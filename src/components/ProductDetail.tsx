import React, { useState } from 'react';
import {
  Box, Typography, Container, Card, CardContent, Button, TextField,
  Chip, Divider, Alert, CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonIcon from '@mui/icons-material/Person';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import VerifiedIcon from '@mui/icons-material/Verified';

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
}

const demoProduct = {
  id: 1,
  name: 'Cyberpunk Art Collection',
  description: 'A stunning collection of cyberpunk-inspired digital art pieces created by renowned digital artists. Each piece is unique and stored permanently on IPFS. This collection represents the intersection of art and blockchain technology.',
  price: '150',
  imageURI: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=600&fit=crop',
  owner: '0x1234567890abcdef1234567890abcdef12345678',
  seller: '0xabcdef1234567890abcdef1234567890abcdef12',
  isListed: true,
  createdAt: '2024-01-15',
};

export default function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [transferAddress, setTransferAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<'buy' | 'transfer' | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleBuy = async () => {
    setLoading(true);
    setError('');
    setAction('buy');
    try {
      // Flow:
      // 1. Request backend for approve tx data (approve marketplace to spend TonysCoin)
      // 2. User signs approve tx in wallet
      // 3. Backend broadcasts approve tx
      // 4. Request backend for buyProduct tx data
      // 5. User signs buyProduct tx in wallet
      // 6. Backend broadcasts buyProduct tx
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Product purchased successfully!');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAddress || !transferAddress.startsWith('0x')) {
      setError('Please enter a valid Ethereum address');
      return;
    }
    setLoading(true);
    setError('');
    setAction('transfer');
    try {
      // Flow:
      // 1. Request backend for transferProductOwnership tx data
      // 2. User signs tx in wallet
      // 3. Backend broadcasts tx
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(`Product transferred to ${transferAddress.slice(0, 10)}...`);
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ color: '#b8b8d4', mb: 4, '&:hover': { color: '#fff' } }}
        >
          Back to Marketplace
        </Button>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {/* Product Image */}
          <Box sx={{ flex: '1 1 400px', maxWidth: '600px' }}>
            <Card
              sx={{
                background: 'rgba(18, 18, 42, 0.8)',
                border: '1px solid rgba(108, 92, 231, 0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={demoProduct.imageURI}
                alt={demoProduct.name}
                sx={{ width: '100%', height: 'auto', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
              />
            </Card>
          </Box>

          {/* Product Details */}
          <Box sx={{ flex: '1 1 400px' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label="Digital Art" sx={{ background: 'rgba(108, 92, 231, 0.2)', color: '#a29bfe' }} />
              <Chip label="Listed" icon={<VerifiedIcon />} sx={{ background: 'rgba(0, 206, 201, 0.2)', color: '#00cec9' }} />
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              {demoProduct.name}
            </Typography>

            <Typography variant="body1" sx={{ color: '#b8b8d4', lineHeight: 1.8, mb: 4 }}>
              {demoProduct.description}
            </Typography>

            {/* Price Card */}
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(0, 206, 201, 0.1))',
                border: '1px solid rgba(108, 92, 231, 0.2)',
                borderRadius: '16px',
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 1 }}>
                  Current Price
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CurrencyBitcoinIcon sx={{ fontSize: 32, color: '#00cec9' }} />
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#00cec9' }}>
                    {demoProduct.price}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#b8b8d4' }}>TONY</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#b8b8d4', mt: 1, display: 'block' }}>
                  + 5% platform fee
                </Typography>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Box sx={{ mb: 3, p: 2, background: 'rgba(18, 18, 42, 0.6)', borderRadius: '12px' }}>
              <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 1 }}>Owner</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ fontSize: 18, color: '#a29bfe' }} />
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#fff' }}>
                  {demoProduct.owner.slice(0, 10)}...{demoProduct.owner.slice(-8)}
                </Typography>
                <ContentCopyIcon sx={{ fontSize: 14, color: '#b8b8d4', cursor: 'pointer' }} />
              </Box>
            </Box>

            {/* Actions */}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={loading && action === 'buy' ? <CircularProgress size={20} /> : <ShoppingCartIcon />}
                onClick={handleBuy}
                disabled={loading}
                className="btn-glow"
                sx={{
                  background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
                  boxShadow: '0 8px 30px rgba(108, 92, 231, 0.4)',
                  flex: 1,
                  minWidth: '200px',
                }}
              >
                Buy Now
              </Button>
            </Box>

            <Divider sx={{ borderColor: 'rgba(108, 92, 231, 0.15)', mb: 3 }} />

            {/* Transfer Section */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SwapHorizIcon sx={{ color: '#fd79a8' }} />
              Transfer Ownership
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="0x... recipient address"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                sx={{
                  flex: 1,
                  minWidth: '250px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                  },
                }}
              />
              <Button
                variant="outlined"
                onClick={handleTransfer}
                disabled={loading}
                startIcon={loading && action === 'transfer' ? <CircularProgress size={20} /> : <SwapHorizIcon />}
                sx={{
                  borderColor: 'rgba(253, 121, 168, 0.5)',
                  color: '#fd79a8',
                  '&:hover': { borderColor: '#fd79a8', background: 'rgba(253, 121, 168, 0.1)' },
                }}
              >
                Transfer
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
