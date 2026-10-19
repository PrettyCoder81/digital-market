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
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
}

// Demo product matching the contract's Product struct
const demoProduct = {
  id: 1,
  name: 'Cyberpunk Art Collection',
  description: 'A stunning collection of cyberpunk-inspired digital art pieces created by renowned digital artists. Each piece is unique and stored permanently on IPFS. This collection represents the intersection of art and blockchain technology.',
  price: '150000000000000000000', // 150 TONY (18 decimals)
  imageURI: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=600&fit=crop',
  owner: '0x1234567890abcdef1234567890abcdef12345678',
  listed: true,
  createdAt: Math.floor(Date.now() / 1000) - 86400 * 7, // 7 days ago
};

export default function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [transferAddress, setTransferAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(demoProduct.name);
  const [editDescription, setEditDescription] = useState(demoProduct.description);
  const [editPrice, setEditPrice] = useState('150');

  const formatPrice = (wei: string) => {
    try {
      const eth = Number(wei) / 1e18;
      return eth.toLocaleString(undefined, { maximumFractionDigits: 4 });
    } catch {
      return '0';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const handleBuy = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setAction('buy');
    try {
      /**
       * BUY PRODUCT FLOW:
       * 1. Frontend requests approve tx data for product.price
       *    POST /api/blockchain/approve-data { amount: product.price, spender: MARKETPLACE_ADDRESS }
       * 2. User signs approve tx in wallet
       * 3. Backend broadcasts approve tx
       * 4. Frontend requests buyProduct tx data
       *    POST /api/blockchain/buy-product-data { productId }
       * 5. User signs buyProduct tx in wallet
       * 6. Backend broadcasts buyProduct tx
       * 
       * Contract splits payment:
       * - seller receives: price - (price * platformFeeBps / 10000)
       * - contract receives: fee (accrued as platform fees)
       */
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Product purchased successfully! You are now the owner.');
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
    setSuccess('');
    setAction('transfer');
    try {
      /**
       * TRANSFER OWNERSHIP FLOW:
       * 1. Frontend requests transferProductOwnership tx data
       *    POST /api/blockchain/transfer-data { productId, newOwner }
       * 2. User signs tx in wallet
       * 3. Backend broadcasts tx
       * 
       * Note: After transfer, product.listed is set to false automatically
       */
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(`Product transferred to ${transferAddress.slice(0, 10)}...`);
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleListing = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setAction('listing');
    try {
      /**
       * SET LISTING FLOW:
       * 1. Frontend requests setListing tx data
       *    POST /api/blockchain/set-listing-data { productId, isListed: !current }
       * 2. User signs tx in wallet
       * 3. Backend broadcasts tx
       */
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(`Product ${demoProduct.listed ? 'unlisted' : 'listed'} successfully!`);
    } catch (err: any) {
      setError(err.message || 'Failed to update listing status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setAction('update');
    try {
      /**
       * UPDATE PRODUCT FLOW:
       * 1. Frontend requests updateProduct tx data
       *    POST /api/blockchain/update-product-data { productId, name, description, price, imageURI }
       * 2. User signs tx in wallet
       * 3. Backend broadcasts tx
       */
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Product updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
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
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={demoProduct.listed ? 'Listed' : 'Unlisted'}
                icon={demoProduct.listed ? <VerifiedIcon /> : <ToggleOffIcon />}
                sx={{
                  background: demoProduct.listed ? 'rgba(0, 206, 201, 0.2)' : 'rgba(253, 121, 168, 0.2)',
                  color: demoProduct.listed ? '#00cec9' : '#fd79a8',
                }}
              />
              <Chip
                label={`ID: ${demoProduct.id}`}
                sx={{ background: 'rgba(108, 92, 231, 0.2)', color: '#a29bfe' }}
              />
            </Box>

            {isEditing ? (
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  fullWidth
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
                <TextField
                  label="Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
                <TextField
                  label="Price (TONY)"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  fullWidth
                  type="number"
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    disabled={loading}
                    sx={{ background: 'linear-gradient(135deg, #6c5ce7, #4a3db5)' }}
                  >
                    {loading && action === 'update' ? <CircularProgress size={20} /> : 'Save Changes'}
                  </Button>
                  <Button onClick={() => setIsEditing(false)} sx={{ color: '#b8b8d4' }}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                  {demoProduct.name}
                </Typography>

                <Typography variant="body1" sx={{ color: '#b8b8d4', lineHeight: 1.8, mb: 3 }}>
                  {demoProduct.description}
                </Typography>
              </>
            )}

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
                    {formatPrice(demoProduct.price)}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#b8b8d4' }}>TONY</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#b8b8d4', mt: 1, display: 'block' }}>
                  + 5% platform fee (500 bps)
                </Typography>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: 1, minWidth: '200px', p: 2, background: 'rgba(18, 18, 42, 0.6)', borderRadius: '12px' }}>
                <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 1 }}>Owner</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: 18, color: '#a29bfe' }} />
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#fff' }}>
                    {demoProduct.owner.slice(0, 10)}...{demoProduct.owner.slice(-8)}
                  </Typography>
                  <ContentCopyIcon sx={{ fontSize: 14, color: '#b8b8d4', cursor: 'pointer' }} />
                </Box>
              </Box>
              <Box sx={{ flex: 1, minWidth: '200px', p: 2, background: 'rgba(18, 18, 42, 0.6)', borderRadius: '12px' }}>
                <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 1 }}>Created</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 18, color: '#55efc4' }} />
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {formatDate(demoProduct.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Status Messages */}
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

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={loading && action === 'buy' ? <CircularProgress size={20} /> : <ShoppingCartIcon />}
                onClick={handleBuy}
                disabled={loading || !demoProduct.listed}
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
              <Button
                variant="outlined"
                size="large"
                startIcon={loading && action === 'listing' ? <CircularProgress size={20} /> : (demoProduct.listed ? <ToggleOffIcon /> : <ToggleOnIcon />)}
                onClick={handleToggleListing}
                disabled={loading}
                sx={{
                  borderColor: 'rgba(0, 206, 201, 0.5)',
                  color: '#00cec9',
                  '&:hover': { borderColor: '#00cec9', background: 'rgba(0, 206, 201, 0.1)' },
                }}
              >
                {demoProduct.listed ? 'Unlist' : 'List'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                sx={{
                  borderColor: 'rgba(162, 155, 254, 0.5)',
                  color: '#a29bfe',
                  '&:hover': { borderColor: '#a29bfe', background: 'rgba(162, 155, 254, 0.1)' },
                }}
              >
                Edit
              </Button>
            </Box>

            <Divider sx={{ borderColor: 'rgba(108, 92, 231, 0.15)', mb: 3 }} />

            {/* Transfer Section */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SwapHorizIcon sx={{ color: '#fd79a8' }} />
              Transfer Ownership
            </Typography>
            <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 2 }}>
              Transfer this product to another wallet address. The product will be automatically unlisted after transfer.
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
