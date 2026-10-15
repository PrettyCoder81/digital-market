import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, IconButton, Collapse,
  Button, Divider
} from '@mui/material';
import { Code, ExpandMore, ExpandLess, ContentCopy, Check } from '@mui/icons-material';

const contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DigitalMarketplace {
    address public owner;
    uint256 public platformFee; // basis points (500 = 5%)
    uint256 public productCount;
    
    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        string imageHash; // IPFS
        address currentOwner;
        bool isForSale;
        bool exists;
    }
    
    mapping(uint256 => Product) public products;
    
    event ProductListed(uint256 id, string name, uint256 price);
    event ProductPurchased(uint256 id, address buyer, uint256 price);
    event OwnershipTransferred(uint256 id, address from, address to);
    event FundsWithdrawn(address owner, uint256 amount);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(uint256 _fee) {
        owner = msg.sender;
        platformFee = _fee;
    }
    
    function listProduct(
        string memory _name,
        string memory _desc,
        uint256 _price,
        string memory _ipfsHash
    ) external {
        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: _name,
            description: _desc,
            price: _price,
            imageHash: _ipfsHash,
            currentOwner: msg.sender,
            isForSale: true,
            exists: true
        });
        emit ProductListed(productCount, _name, _price);
    }
    
    function purchaseProduct(uint256 _id) external payable {
        Product storage p = products[_id];
        require(p.isForSale, "Not for sale");
        require(msg.value == p.price, "Wrong amount");
        
        uint256 fee = (p.price * platformFee) / 10000;
        address prevOwner = p.currentOwner;
        
        p.currentOwner = msg.sender;
        p.isForSale = false;
        
        (bool ok, ) = prevOwner.call{value: p.price - fee}("");
        require(ok, "Transfer failed");
        
        emit ProductPurchased(_id, msg.sender, p.price);
    }
    
    function transferOwnership(uint256 _id, address _to) external {
        require(products[_id].currentOwner == msg.sender, "Not owner");
        products[_id].currentOwner = _to;
        products[_id].isForSale = false;
        emit OwnershipTransferred(_id, msg.sender, _to);
    }
    
    function withdrawFunds() external onlyOwner {
        uint256 bal = address(this).balance;
        (bool ok, ) = owner.call{value: bal}("");
        require(ok, "Withdrawal failed");
        emit FundsWithdrawn(owner, bal);
    }
    
    function updatePlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 2500, "Max 25%");
        uint256 old = platformFee;
        platformFee = _fee;
        emit PlatformFeeUpdated(old, _fee);
    }
}`;

export default function ContractInfo() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card sx={{
      mt: 4,
      border: '1px solid rgba(124,58,237,0.2)',
      overflow: 'hidden',
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Code color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Smart Contract
            </Typography>
            <Chip label="Solidity ^0.8.20" size="small" variant="outlined" />
          </Box>
          <Button
            size="small"
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide' : 'View'} Code
          </Button>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="listProduct()" size="small" color="primary" variant="outlined" />
          <Chip label="purchaseProduct()" size="small" color="success" variant="outlined" />
          <Chip label="transferOwnership()" size="small" color="secondary" variant="outlined" />
          <Chip label="withdrawFunds()" size="small" color="warning" variant="outlined" />
          <Chip label="updatePlatformFee()" size="small" variant="outlined" />
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2, position: 'relative' }}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
            </IconButton>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: '#0d1117',
                borderRadius: 2,
                overflow: 'auto',
                maxHeight: 400,
                fontSize: '0.75rem',
                lineHeight: 1.6,
                color: '#c9d1d9',
                border: '1px solid rgba(124,58,237,0.2)',
                '& code': { fontFamily: "'Fira Code', 'Courier New', monospace" },
              }}
            >
              <code>{contractCode}</code>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
