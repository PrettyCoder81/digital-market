import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Close,
  CloudUpload,
  Add,
  Image as ImageIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useMarketplace } from '../context/MarketplaceContext';
import { categories } from '../data/products';

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddProductDialog({ open, onClose }: AddProductDialogProps) {
  const { addProduct, platformFee } = useMarketplace();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Digital Art');
  const [imagePreview, setImagePreview] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Digital Art');
    setImagePreview('');
    setIpfsHash('');
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Convert to data URL for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setImagePreview(dataUrl);
        
        // Simulate IPFS upload (generate fake hash)
        const fakeHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        setIpfsHash(fakeHash);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image');
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (!imagePreview && !ipfsHash) {
      setError('Please upload an image or provide an IPFS hash');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Simulate IPFS upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const finalIpfsHash = ipfsHash || `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      addProduct({
        name: name.trim(),
        description: description.trim(),
        price,
        image: imagePreview || `https://ipfs.io/ipfs/${finalIpfsHash}`,
        category,
        isForSale: true,
        ipfsHash: finalIpfsHash,
      });

      setSuccess('Product added successfully!');
      
      // Close after 1.5 seconds
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  const feeAmount = price && parseFloat(price) > 0 
    ? (parseFloat(price) * platformFee / 100).toFixed(4)
    : '0';
  const ownerReceives = price && parseFloat(price) > 0
    ? (parseFloat(price) * (1 - platformFee / 100)).toFixed(4)
    : '0';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid rgba(124,58,237,0.2)',
          }
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Add New Product
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {/* Image Upload */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Product Image *
            </Typography>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            {imagePreview ? (
              <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(124,58,237,0.2)' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: 300, objectFit: 'cover' }}
                />
                <IconButton
                  onClick={() => {
                    setImagePreview('');
                    setIpfsHash('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  }}
                  size="small"
                >
                  <Close fontSize="small" />
                </IconButton>
                {ipfsHash && (
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    p: 1,
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                  }}>
                    IPFS: {ipfsHash.slice(0, 20)}...
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: '2px dashed rgba(124,58,237,0.3)',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(124,58,237,0.05)',
                  },
                }}
              >
                {uploading ? (
                  <Box>
                    <CircularProgress size={40} sx={{ mb: 1 }} />
                    <Typography variant="body2">Uploading to IPFS...</Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Click to upload image
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PNG, JPG, GIF up to 10MB
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Name */}
          <TextField
            label="Product Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            error={!!error && !name.trim()}
            helperText={!name.trim() && error ? 'Name is required' : ''}
          />

          {/* Description */}
          <TextField
            label="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            multiline
            rows={3}
            error={!!error && !description.trim()}
            helperText={!description.trim() && error ? 'Description is required' : ''}
          />

          {/* Price and Category */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Price (ETH) *"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
              error={!!error && (!price || parseFloat(price) <= 0)}
            />
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select
                value={category}
                label="Category *"
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Fee Breakdown */}
          {price && parseFloat(price) > 0 && (
            <Box sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.2)',
            }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Transaction Breakdown
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Platform Fee ({platformFee}%)</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{feeAmount} ETH</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">You Receive</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {ownerReceives} ETH
                </Typography>
              </Box>
            </Box>
          )}

          {/* Alerts */}
          {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <Add />}
          sx={{
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #0891b2)' },
          }}
        >
          {uploading ? 'Adding...' : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
