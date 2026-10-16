import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box,
  Chip, IconButton, Divider, TextField, Alert, CircularProgress
} from '@mui/material';
import {
  Close, ShoppingCart, Send, OpenInNew,
  AccountBalance, Sell
} from '@mui/icons-material';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import CopyAddress from './CopyAddress';

interface ProductDetailProps {
  productId: string | null;
  onClose: () => void;
}

export default function ProductDetail({ productId, onClose }: ProductDetailProps) {
  const {
    products, purchaseProduct, transferOwnership,
    platformFee, isProductOwner, listForSale, delistProduct, isConnected
  } = useMarketplace();

  // Derive fresh product from context every render (no stale references)
  const product = useMemo<Product | null>(
    () => products.find(p => p.id === productId) ?? null,
    [products, productId]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [sellPrice, setSellPrice] = useState('');

  // Reset all internal states when product changes or dialog closes
  useEffect(() => {
    setError('');
    setSuccess('');
    setTransferAddress('');
    setShowTransfer(false);
    setShowSellDialog(false);
    setSellPrice('');
    setLoading(false);
  }, [productId]);

  const owned = product ? isProductOwner(product.id) : false;
  const feeAmount = product ? (parseFloat(product.price) * platformFee) / 100 : 0;
  const ownerReceives = product ? parseFloat(product.price) - feeAmount : 0;

  const handlePurchase = useCallback(async () => {
    if (!product) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await purchaseProduct(product.id);
      setSuccess('Purchase successful! You now own this product.');
    } catch (err: any) {
      setError(err.message || 'Purchase failed');
    }
    setLoading(false);
  }, [product, purchaseProduct]);

  const handleTransfer = useCallback(async () => {
    if (!product) return;
    if (!transferAddress.startsWith('0x') || transferAddress.length !== 42) {
      setError('Invalid Ethereum address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await transferOwnership(product.id, transferAddress);
      setSuccess('Ownership transferred successfully!');
      setShowTransfer(false);
      setTransferAddress('');
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    }
    setLoading(false);
  }, [product, transferOwnership, transferAddress]);

  const handleListForSale = useCallback(() => {
    if (!product) return;
    if (!sellPrice || parseFloat(sellPrice) <= 0) {
      setError('Please enter a valid price');
      return;
    }
    setError('');
    try {
      listForSale(product.id, sellPrice);
      setSuccess('Product listed for sale!');
      setShowSellDialog(false);
      setSellPrice('');
    } catch (err: any) {
      setError(err.message || 'Failed to list product');
    }
  }, [product, listForSale, sellPrice]);

  const handleDelist = useCallback(() => {
    if (!product) return;
    setError('');
    try {
      delistProduct(product.id);
      setSuccess('Product removed from sale.');
    } catch (err: any) {
      setError(err.message || 'Failed to delist product');
    }
  }, [product, delistProduct]);

  // Guard: no product to show
  if (!product) return null;

  return (
    <>
      <Dialog
        open={!!productId}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              borderRadius: 3,
              border: '1px solid rgba(124,58,237,0.2)',
              maxHeight: '90vh',
            }
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, pr: 2 }}>
              {product.name}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
          }}>
            {/* Image Column */}
            <Box sx={{ flex: { xs: 1, md: '0 0 45%' }, minWidth: 0 }}>
              <Box sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid rgba(124,58,237,0.2)',
                position: 'sticky',
                top: 0,
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </Box>
            </Box>

            {/* Info Column */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={product.category} color="primary" size="small" />
                {product.isForSale ? (
                  <Chip label="For Sale" color="success" size="small" />
                ) : (
                  <Chip label="Not Listed" size="small" />
                )}
                {owned && (
                  <Chip label="You Own This" color="warning" size="small" />
                )}
              </Box>

              <Typography variant="body1" color="text.secondary">
                {product.description}
              </Typography>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">Current Price</Typography>
                <Typography variant="h4" sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {product.price} ETH
                </Typography>
              </Box>

              {product.isForSale && (
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.2)',
                }}>
                  <Typography variant="caption" color="text.secondary">Transaction Breakdown</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">Platform Fee ({platformFee}%)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{feeAmount.toFixed(4)} ETH</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Owner Receives</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {ownerReceives.toFixed(4)} ETH
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box>
                <Typography variant="caption" color="text.secondary">Owner</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <CopyAddress address={product.owner} shorten={true} />
                </Box>
              </Box>

              {product.ipfsHash && (
                <Box>
                  <Typography variant="caption" color="text.secondary">IPFS Hash</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {product.ipfsHash.slice(0, 20)}...
                    </Typography>
                    <IconButton size="small">
                      <OpenInNew fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}

              {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
              {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                {product.isForSale && !owned && isConnected && (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShoppingCart />}
                    onClick={handlePurchase}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                      '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #0891b2)' },
                      py: 1.5,
                    }}
                  >
                    {loading ? 'Processing...' : `Purchase for ${product.price} ETH`}
                  </Button>
                )}

                {product.isForSale && !owned && !isConnected && (
                  <Alert severity="info" sx={{ textAlign: 'center' }}>
                    Connect your wallet to purchase this product
                  </Alert>
                )}

                {owned && (
                  <>
                    {!product.isForSale && (
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Sell />}
                        onClick={() => setShowSellDialog(true)}
                        color="success"
                      >
                        List for Sale
                      </Button>
                    )}
                    {product.isForSale && (
                      <Button variant="outlined" fullWidth onClick={handleDelist} color="warning">
                        Remove from Sale
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Send />}
                      onClick={() => setShowTransfer(!showTransfer)}
                    >
                      Transfer Ownership
                    </Button>
                  </>
                )}
              </Box>

              {showTransfer && owned && (
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(6,182,212,0.08)',
                  border: '1px solid rgba(6,182,212,0.2)',
                }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Transfer to another wallet (no ETH required)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="0x..."
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleTransfer}
                    disabled={loading || !transferAddress}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send />}
                    color="secondary"
                  >
                    {loading ? 'Transferring...' : 'Transfer'}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Sell Sub-dialog */}
      <Dialog
        open={showSellDialog}
        onClose={() => setShowSellDialog(false)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              borderRadius: 2,
              minWidth: { xs: 'auto', sm: 400 },
            }
          }
        }}
      >
        <DialogTitle>List for Sale</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set the price in ETH for this product
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalance sx={{ color: 'text.secondary' }} />
            <TextField
              fullWidth
              label="Price (ETH)"
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
          </Box>
          {sellPrice && parseFloat(sellPrice) > 0 && (
            <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(124,58,237,0.08)', borderRadius: 1 }}>
              <Typography variant="caption">
                Platform fee ({platformFee}%): {(parseFloat(sellPrice) * platformFee / 100).toFixed(4)} ETH
              </Typography>
              <br />
              <Typography variant="caption" sx={{ color: 'success.main' }}>
                You receive: {(parseFloat(sellPrice) * (1 - platformFee / 100)).toFixed(4)} ETH
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSellDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleListForSale} color="success">
            List for Sale
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
