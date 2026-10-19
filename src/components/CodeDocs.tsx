import React, { useState } from 'react';
import {
  Box, Typography, Container, Card, CardContent, Tabs, Tab, Chip,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import DnsIcon from '@mui/icons-material/Dns';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DigitalMarketPlace is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable paymentToken;

    uint256 public constant FEE_DENOMINATOR = 10_000;
    uint256 public constant MAX_FEE_BPS = 10_000; // 10%
    uint256 public platformFeeBps = 500; // 5%
    
    uint256 public listingFee = 10 * 10**18; // Default 10 Tokens

    uint256 public nextProductId = 1;
    uint256 public accruedPlatformFees;

    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        string imageURI;
        address owner;
        bool listed;
        uint256 createdAt;
    }

    mapping(uint256 => Product) private products;

    event ProductCreated(uint256 indexed productId, address indexed owner, uint256 price);
    event ProductUpdated(uint256 indexed productId);
    event ProductListingChanged(uint256 indexed productId, bool listed);
    event ProductPurchased(uint256 indexed productId, address indexed buyer, address indexed seller, uint256 price, uint256 fee);
    event ProductOwnershipTransferred(uint256 indexed productId, address indexed previousOwner, address indexed newOwner);
    event PlatformFeeUpdated(uint256 oldFeeBps, uint256 newFeeBps);
    event ListingFeeUpdated(uint256 oldFee, uint256 newFee);
    event PlatformFeesWithdrawn(address indexed recipient, uint256 amount);

    constructor(address tokenAddress) Ownable(msg.sender) {
        require(tokenAddress != address(0), "Invalid token address");
        paymentToken = IERC20(tokenAddress);
    }

    function createProduct(string calldata name, string calldata description, uint256 price, string calldata imageURI) external returns (uint256 productId) {
        require(bytes(name).length > 0, "Name required");
        require(price > 0, "Price must be positive");
        require(bytes(imageURI).length > 0, "Image URI required");

        // Deduct listing fee in TonysCoin
        paymentToken.safeTransferFrom(msg.sender, address(this), listingFee);

        productId = nextProductId++;
        products[productId] = Product({
            id: productId,
            name: name,
            description: description,
            price: price,
            imageURI: imageURI,
            owner: msg.sender,
            listed: true,
            createdAt: block.timestamp
        });

        emit ProductCreated(productId, msg.sender, price);
    }

    function getProduct(uint256 productId) external view returns (Product memory) {
        require(products[productId].id != 0, "Product not found");
        return products[productId];
    }

    function getAllProducts() external view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](nextProductId - 1);
        for (uint256 i = 1; i < nextProductId; i++) {
            if (products[i].id != 0) {
                allProducts[i - 1] = products[i];
            }
        }
        return allProducts;
    }

    function updateProduct(uint256 productId, string calldata name, string calldata description, uint256 price, string calldata imageURI) external {
        Product storage p = products[productId];
        require(p.id != 0, "Product not found");
        require(p.owner == msg.sender, "Not product owner");
        require(bytes(name).length > 0, "Name required");
        require(price > 0, "Price must be positive");
        require(bytes(imageURI).length > 0, "Image URI required");

        p.name = name;
        p.description = description;
        p.price = price;
        p.imageURI = imageURI;
        emit ProductUpdated(productId);
    }

    function setListing(uint256 productId, bool isListed) external {
        Product storage p = products[productId];
        require(p.id != 0, "Product not found");
        require(p.owner == msg.sender, "Not product owner");
        p.listed = isListed;
        emit ProductListingChanged(productId, isListed);
    }

    function buyProduct(uint256 productId) external nonReentrant {
        Product storage p = products[productId];
        require(p.id != 0, "Product not found");
        require(p.listed, "Product not listed");
        require(p.owner != msg.sender, "Cannot buy own product");

        address seller = p.owner;
        uint256 price = p.price;
        uint256 fee = (price * platformFeeBps) / FEE_DENOMINATOR;
        uint256 sellerAmount = price - fee;

        p.listed = false;
        p.owner = msg.sender;

        paymentToken.safeTransferFrom(msg.sender, seller, sellerAmount);
        paymentToken.safeTransferFrom(msg.sender, address(this), fee);
        accruedPlatformFees += fee;

        emit ProductPurchased(productId, msg.sender, seller, price, fee);
    }

    function transferProductOwnership(uint256 productId, address newOwner) external {
        Product storage p = products[productId];
        require(p.id != 0, "Product not found");
        require(p.owner == msg.sender, "Not product owner");
        require(newOwner != address(0), "Invalid recipient");
        require(newOwner != msg.sender, "Already owner");

        address previousOwner = p.owner;
        p.owner = newOwner;
        p.listed = false;

        emit ProductOwnershipTransferred(productId, previousOwner, newOwner);
        emit ProductListingChanged(productId, false);
    }

    function setPlatformFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= MAX_FEE_BPS, "Fee exceeds maximum");
        uint256 oldFeeBps = platformFeeBps;
        platformFeeBps = newFeeBps;
        emit PlatformFeeUpdated(oldFeeBps, newFeeBps);
    }

    function setListingFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = listingFee;
        listingFee = newFee;
        emit ListingFeeUpdated(oldFee, newFee);
    }

    function withdrawPlatformFees(address recipient, uint256 amount) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        require(amount <= accruedPlatformFees, "Insufficient fee balance");

        accruedPlatformFees -= amount;
        paymentToken.safeTransfer(recipient, amount);
        emit PlatformFeesWithdrawn(recipient, amount);
    }
}`;

const serverCode = `// src/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import ipfsRoutes from './routes/ipfsRoutes.js';
import blockchainRoutes from './routes/blockchainRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/ipfs', ipfsRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`🚀 Server running on port \${PORT}\`));`;

const modelCode = `// src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  imageURI: { type: String, required: true },
  owner: { type: String, required: true },
  listed: { type: Boolean, default: true },
  createdAt: { type: Number, default: Date.now },
  txHash: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Product', productSchema);`;

const ipfsControllerCode = `// src/controllers/ipfsController.js
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export const uploadToIPFS = async (file) => {
  try {
    const blob = new Blob([file.buffer]);
    const fileObj = new File([blob], file.originalname, { type: file.mimetype });
    
    const upload = await pinata.upload.file(fileObj);
    const url = await pinata.gateways.convert(upload.IpfsHash);
    
    return { ipfsHash: upload.IpfsHash, url };
  } catch (error) {
    throw new Error(\`IPFS upload failed: \${error.message}\`);
  }
};`;

const blockchainControllerCode = `// src/controllers/blockchainController.js
import { ethers } from 'ethers';
import { MARKETPLACE_ABI, ERC20_ABI } from '../utils/abis.js';

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);

const marketplaceContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  MARKETPLACE_ABI,
  adminWallet
);

const tokenContract = new ethers.Contract(
  process.env.TOKEN_ADDRESS,
  ERC20_ABI,
  provider
);

// ========== READ METHODS ==========
export const getProductCount = async () => {
  return await marketplaceContract.nextProductId();
};

export const getProduct = async (id) => {
  return await marketplaceContract.getProduct(id);
};

export const getAllProducts = async () => {
  return await marketplaceContract.getAllProducts();
};

export const getListingFee = async () => {
  return await marketplaceContract.listingFee();
};

export const getPlatformFeeBps = async () => {
  return await marketplaceContract.platformFeeBps();
};

export const getAccruedFees = async () => {
  return await marketplaceContract.accruedPlatformFees();
};

// ========== TRANSACTION DATA BUILDERS (for frontend signing) ==========

/**
 * Build approve() tx data for TonysCoin.
 * 
 * ERC20 APPROVE FLOW:
 * 1. User must first approve the marketplace contract to spend TonysCoin
 * 2. For createProduct: approve listingFee amount
 * 3. For buyProduct: approve product.price amount
 * 4. Frontend gets this tx data, user signs in wallet, backend broadcasts
 */
export const getApproveData = (amount, spender) => {
  const tokenInterface = new ethers.Interface(ERC20_ABI);
  return tokenInterface.encodeFunctionData('approve', [spender, amount]);
};

/**
 * Build createProduct() tx data
 * Note: User must have approved listingFee BEFORE this tx is signed
 */
export const getCreateProductData = async (name, description, price, imageURI) => {
  return await marketplaceContract.createProduct.populateTransaction(
    name, description, price, imageURI
  );
};

/**
 * Build buyProduct() tx data
 * Note: User must have approved product.price BEFORE this tx is signed
 */
export const getBuyProductData = async (productId) => {
  return await marketplaceContract.buyProduct.populateTransaction(productId);
};

/**
 * Build transferProductOwnership() tx data
 */
export const getTransferData = async (productId, newOwner) => {
  return await marketplaceContract.transferProductOwnership.populateTransaction(
    productId, newOwner
  );
};

/**
 * Build setListing() tx data
 */
export const getSetListingData = async (productId, isListed) => {
  return await marketplaceContract.setListing.populateTransaction(productId, isListed);
};

/**
 * Build updateProduct() tx data
 */
export const getUpdateProductData = async (productId, name, description, price, imageURI) => {
  return await marketplaceContract.updateProduct.populateTransaction(
    productId, name, description, price, imageURI
  );
};

// ========== BROADCAST SIGNED TX ==========
export const broadcastTransaction = async (signedTx) => {
  const tx = await provider.broadcastTransaction(signedTx);
  return await tx.wait();
};

// ========== ADMIN EXECUTION (backend signs directly) ==========
export const adminSetListingFee = async (newFee) => {
  const tx = await marketplaceContract.setListingFee(newFee);
  return await tx.wait();
};

export const adminSetPlatformFee = async (newFeeBps) => {
  const tx = await marketplaceContract.setPlatformFee(newFeeBps);
  return await tx.wait();
};

/**
 * withdrawPlatformFees takes (recipient, amount)
 * Backend admin signs this directly
 */
export const adminWithdrawFees = async (recipient, amount) => {
  const tx = await marketplaceContract.withdrawPlatformFees(recipient, amount);
  return await tx.wait();
};`;

const envExample = `# Backend .env
PINATA_JWT=your_pinata_jwt_token
PINATA_GATEWAY=your_gateway_url
MONGODB_URI=mongodb://localhost:27017/digital-marketplace
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
ADMIN_PRIVATE_KEY=0x_your_admin_private_key
CONTRACT_ADDRESS=0xD0416f8178af9FD7534BB7db9C8cBDD246130D77
TOKEN_ADDRESS=0x0C3fE514a1977ea6521d705171Ebcb916ABD28Be
PORT=5000

# Frontend .env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0xD0416f8178af9FD7534BB7db9C8cBDD246130D77
VITE_TOKEN_ADDRESS=0x0C3fE514a1977ea6521d705171Ebcb916ABD28Be`;

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null;
}

export default function CodeDocs() {
  const [tabValue, setTabValue] = useState(0);

  const tabs = [
    { label: 'Smart Contract', icon: <AccountTreeIcon /> },
    { label: 'Backend Server', icon: <DnsIcon /> },
    { label: 'Model', icon: <StorageIcon /> },
    { label: 'IPFS Controller', icon: <CodeIcon /> },
    { label: 'Blockchain Controller', icon: <CodeIcon /> },
    { label: 'Environment', icon: <StorageIcon /> },
  ];

  const codeBlocks = [contractCode, serverCode, modelCode, ipfsControllerCode, blockchainControllerCode, envExample];

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#6c5ce7', fontWeight: 600, letterSpacing: 3 }}>
            SOURCE CODE
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
            Project <span className="gradient-text">Architecture</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#b8b8d4', mt: 1 }}>
            Complete source code for the Digital Marketplace — Smart Contract (Solidity ^0.8.24), Backend, and Configuration.
          </Typography>
        </Box>

        {/* Architecture diagram */}
        <Card sx={{ mb: 4, background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.12)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>System Architecture</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {[
                { label: 'Frontend (React)', color: '#6c5ce7', desc: 'MUI + Axios' },
                { label: 'Backend (Express)', color: '#00cec9', desc: 'REST API' },
                { label: 'MongoDB', color: '#55efc4', desc: 'Product Data' },
                { label: 'Ethereum Sepolia', color: '#fd79a8', desc: 'Smart Contract' },
                { label: 'IPFS (Pinata)', color: '#a29bfe', desc: 'Image Storage' },
                { label: 'TonysCoin ERC20', color: '#ffeaa7', desc: 'Payment Token' },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    border: `1px solid ${item.color}40`,
                    background: `${item.color}10`,
                    textAlign: 'center',
                    minWidth: '140px',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700, color: item.color }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b8b8d4' }}>
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#b8b8d4' }}>
                Frontend → REST API → Backend → Blockchain / IPFS / MongoDB
              </Typography>
              <Typography variant="caption" sx={{ color: '#6c5ce7' }}>
                Strict separation: Frontend never directly connects to Web3 provider
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Code tabs */}
        <Card sx={{ background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.12)' }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid rgba(108, 92, 231, 0.15)',
              '& .MuiTab-root': { color: '#b8b8d4', textTransform: 'none', fontWeight: 600 },
              '& .Mui-selected': { color: '#6c5ce7 !important' },
            }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.label} icon={tab.icon} iconPosition="start" label={tab.label} />
            ))}
          </Tabs>
          <CardContent>
            {codeBlocks.map((code, index) => (
              <TabPanel key={index} value={tabValue} index={index}>
                <Box className="code-block" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 600, overflow: 'auto' }}>
                  <code>{code}</code>
                </Box>
              </TabPanel>
            ))}
          </CardContent>
        </Card>

        {/* Transaction Flow */}
        <Card sx={{ mt: 4, background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.12)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              🔑 Transaction Signing Flow
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { step: '1', title: 'Frontend requests tx data', desc: 'POST /api/blockchain/create-product-data' },
                { step: '2', title: 'Backend builds unsigned tx', desc: 'Constructs transaction with contract call data' },
                { step: '3', title: 'Frontend shows wallet prompt', desc: 'User signs transaction in MetaMask' },
                { step: '4', title: 'Signed tx returned to backend', desc: 'POST /api/blockchain/broadcast' },
                { step: '5', title: 'Backend broadcasts to network', desc: 'provider.broadcastTransaction(signedTx)' },
              ].map((item) => (
                <Box key={item.step} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
                  }}>
                    {item.step}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#b8b8d4', fontFamily: 'monospace' }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* ERC20 Approve Flow */}
        <Card sx={{ mt: 4, background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.12)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              💰 ERC20 Approve + Transaction Flow
            </Typography>
            <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 3 }}>
              Since all payments are in TonysCoin (ERC20), users must approve the contract before any token transfer occurs.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { step: 'A', title: 'Approve Listing Fee', desc: 'User approves marketplace to spend listingFee (10 TONY) via ERC20.approve()' },
                { step: 'B', title: 'Create Product', desc: 'User signs createProduct() — contract calls safeTransferFrom for listingFee' },
                { step: 'C', title: 'Approve Purchase Price', desc: 'Buyer approves marketplace to spend product.price via ERC20.approve()' },
                { step: 'D', title: 'Buy Product', desc: 'Buyer signs buyProduct() — contract splits payment: seller gets (price - 5% fee), contract keeps fee' },
              ].map((item) => (
                <Box key={item.step} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{
                    width: 32, height: 32, borderRadius: '8px',
                    background: 'linear-gradient(135deg, #fd79a8, #6c5ce7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
                  }}>
                    {item.step}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#b8b8d4' }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
