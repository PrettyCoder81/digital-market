import React, { useState } from 'react';
import {
  Box, Typography, Container, Card, CardContent, Tabs, Tab, Chip,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import DnsIcon from '@mui/icons-material/Dns';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DigitalMarketPlace is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        string imageURI;
        address payable owner;
        address payable seller;
        bool isListed;
    }

    IERC20 public paymentToken;
    address public owner;
    uint256 public productCount;
    uint256 public platformFeePercent = 5; // 5%
    uint256 public listingFee = 10 * 10**18; // 10 TONY (18 decimals)
    
    mapping(uint256 => Product) public products;

    event ProductCreated(uint256 indexed productId, address indexed seller, string name, uint256 price, string imageURI);
    event ProductPurchased(uint256 indexed productId, address indexed buyer, uint256 price, uint256 platformFee);
    event OwnershipTransferred(uint256 indexed productId, address indexed from, address indexed to);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor(address _paymentToken) {
        paymentToken = IERC20(_paymentToken);
        owner = msg.sender;
    }

    function createProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _imageURI
    ) external nonReentrant {
        require(_price > 0, "Price must be > 0");
        require(bytes(_name).length > 0, "Name required");

        // Pay listing fee in TonysCoin
        paymentToken.safeTransferFrom(msg.sender, address(this), listingFee);

        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: _name,
            description: _description,
            price: _price,
            imageURI: _imageURI,
            owner: payable(msg.sender),
            seller: payable(msg.sender),
            isListed: true
        });

        emit ProductCreated(productCount, msg.sender, _name, _price, _imageURI);
    }

    function buyProduct(uint256 _productId) external nonReentrant {
        Product storage product = products[_productId];
        require(product.isListed, "Not listed");
        require(product.owner != msg.sender, "Cannot buy own product");

        uint256 fee = (product.price * platformFeePercent) / 100;
        uint256 sellerAmount = product.price - fee;

        // Transfer payment token
        paymentToken.safeTransferFrom(msg.sender, product.seller, sellerAmount);
        paymentToken.safeTransferFrom(msg.sender, address(this), fee);

        product.owner = payable(msg.sender);
        product.isListed = false;

        emit ProductPurchased(_productId, msg.sender, product.price, fee);
    }

    function transferProductOwnership(uint256 _productId, address _newOwner) external {
        Product storage product = products[_productId];
        require(product.owner == msg.sender, "Not owner");
        require(_newOwner != address(0), "Invalid address");

        product.owner = payable(_newOwner);
        emit OwnershipTransferred(_productId, msg.sender, _newOwner);
    }

    // Admin functions
    function setPlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 20, "Fee too high");
        platformFeePercent = _newFeePercent;
    }

    function setListingFee(uint256 _newListingFee) external onlyOwner {
        listingFee = _newListingFee;
    }

    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        paymentToken.safeTransfer(owner, balance);
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
  seller: { type: String, required: true },
  isListed: { type: Boolean, default: true },
  txHash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Product', productSchema);`;

const ipfsControllerCode = `// src/controllers/ipfsController.js
import { PinataSDK } from "pinata";
import path from 'path';

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

// Read methods
export const getProductCount = async () => {
  return await marketplaceContract.productCount();
};

export const getProduct = async (id) => {
  return await marketplaceContract.products(id);
};

export const getListingFee = async () => {
  return await marketplaceContract.listingFee();
};

// Transaction data builders (for frontend signing)
export const getApproveData = (amount, spender) => {
  const tokenInterface = new ethers.Interface(ERC20_ABI);
  return tokenInterface.encodeFunctionData('approve', [spender, amount]);
};

export const getCreateProductData = (name, description, price, imageURI) => {
  return marketplaceContract.createProduct.populateTransaction(
    name, description, price, imageURI
  );
};

// Admin execution (backend signs directly)
export const adminSetListingFee = async (newFee) => {
  const tx = await marketplaceContract.setListingFee(newFee);
  return await tx.wait();
};

export const adminWithdrawFees = async () => {
  const tx = await marketplaceContract.withdrawPlatformFees();
  return await tx.wait();
};

// Broadcast signed transaction
export const broadcastTransaction = async (signedTx) => {
  const tx = await provider.broadcastTransaction(signedTx);
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
            Complete source code for the Digital Marketplace - Smart Contract, Backend, and Configuration.
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
                Frontend → REST API → Backend → Blockchain/IPFS/MongoDB
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
              '& .Mui-selected': { color: '#6c5ce7' },
            }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.label} icon={tab.icon} iconPosition="start" label={tab.label} />
            ))}
          </Tabs>
          <CardContent>
            {codeBlocks.map((code, index) => (
              <TabPanel key={index} value={tabValue} index={index}>
                <Box className="code-block" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
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
      </Container>
    </Box>
  );
}
