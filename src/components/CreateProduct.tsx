import React, { useState } from 'react';
import {
  Box, Typography, Container, TextField, Button, Card, CardContent,
  Alert, CircularProgress, Stepper, Step, StepLabel,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ImageIcon from '@mui/icons-material/Image';

interface CreateProductProps {
  onCreated: () => void;
}

const steps = ['Upload Image', 'Product Details', 'Approve & Create'];

export default function CreateProduct({ onCreated }: CreateProductProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Contract constants
  const LISTING_FEE_TONY = 10; // 10 TONY (default listingFee = 10 * 10^18)
  const PLATFORM_FEE_BPS = 500; // 5%

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !imageFile) {
      setError('Please upload an image');
      return;
    }
    if (activeStep === 1 && (!name || !price)) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      /**
       * CREATE PRODUCT FLOW (strict backend-mediated):
       * 
       * Step 1: Upload image to IPFS
       *   POST /api/ipfs/upload (multipart/form-data with image file)
       *   → Backend uploads to Pinata → Returns IPFS URI
       * 
       * Step 2: Get approve tx data for listing fee
       *   POST /api/blockchain/prepare-approve
       *   → Backend constructs: tokenContract.approve(MARKETPLACE_ADDRESS, listingFee)
       *   → Returns unsigned tx data to frontend
       * 
       * Step 3: User signs approve tx in MetaMask
       *   → Frontend calls wallet.signTransaction(unsignedTx)
       *   → Returns signedTx to backend
       * 
       * Step 4: Backend broadcasts approve tx
       *   POST /api/blockchain/broadcast { signedTransaction }
       *   → provider.broadcastTransaction(signedTx)
       * 
       * Step 5: Get createProduct tx data
       *   POST /api/blockchain/prepare-create
       *   → Backend constructs: contract.createProduct(name, description, price, imageURI)
       *   → Returns unsigned tx data to frontend
       * 
       * Step 6: User signs createProduct tx in MetaMask
       *   → Frontend calls wallet.signTransaction(unsignedTx)
       *   → Returns signedTx to backend
       * 
       * Step 7: Backend broadcasts createProduct tx
       *   POST /api/blockchain/broadcast { signedTransaction }
       *   → Contract calls: paymentToken.safeTransferFrom(msg.sender, address(this), listingFee)
       *   → Product is created on-chain
       * 
       * Note: The contract's createProduct requires prior ERC20 approval for listingFee.
       * The contract uses: paymentToken.safeTransferFrom(msg.sender, address(this), listingFee)
       */

      // Simulating the complete flow for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setTimeout(() => onCreated(), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#6c5ce7', fontWeight: 600, letterSpacing: 3 }}>
            CREATE LISTING
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
            List Your <span className="gradient-text">Digital Product</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#b8b8d4', mt: 2, maxWidth: 500, mx: 'auto' }}>
            Upload your product image, set a price in TonysCoin, and list it on the decentralized marketplace.
          </Typography>
        </Box>

        <Card sx={{ background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.15)' }}>
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} icon={<CheckCircleIcon />}>
                Product created successfully! The listing fee of {LISTING_FEE_TONY} TONY has been deducted. Redirecting...
              </Alert>
            )}

            {activeStep === 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    border: '2px dashed rgba(108, 92, 231, 0.3)',
                    borderRadius: '20px',
                    p: 6,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: imagePreview ? 'transparent' : 'rgba(108, 92, 231, 0.05)',
                    '&:hover': {
                      borderColor: '#6c5ce7',
                      background: 'rgba(108, 92, 231, 0.1)',
                    },
                  }}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {imagePreview ? (
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{ maxWidth: '100%', maxHeight: 300, borderRadius: '12px', objectFit: 'contain' }}
                    />
                  ) : (
                    <>
                      <ImageIcon sx={{ fontSize: 64, color: '#6c5ce7', mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Drop your image here or click to browse
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b8b8d4' }}>
                        PNG, JPG, GIF up to 10MB — Will be uploaded to IPFS via Pinata
                      </Typography>
                    </>
                  )}
                </Box>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Box>
            )}

            {activeStep === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)',
                    },
                  }}
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)',
                    },
                  }}
                />
                <TextField
                  label="Price (TonysCoin)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth
                  required
                  type="number"
                  slotProps={{ input: { endAdornment: <Typography sx={{ color: '#b8b8d4' }}>TONY</Typography> } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)',
                    },
                  }}
                />
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                  <strong>Listing Fee:</strong> {LISTING_FEE_TONY} TONY will be deducted from your wallet when creating this product.
                  <br />
                  <strong>Platform Fee:</strong> {PLATFORM_FEE_BPS / 100}% of the sale price goes to the platform when the product is purchased.
                </Alert>
              </Box>
            )}

            {activeStep === 2 && (
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(108, 92, 231, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 40, color: '#6c5ce7' }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Ready to Create Product
                </Typography>
                <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 3, maxWidth: 450, mx: 'auto' }}>
                  You will be asked to sign <strong>two transactions</strong> in your wallet:
                </Typography>

                <Box sx={{ background: 'rgba(18, 18, 42, 0.8)', borderRadius: '12px', p: 3, mb: 3, textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 1.5 }}>
                    <strong style={{ color: '#00cec9' }}>Tx 1:</strong> Approve {LISTING_FEE_TONY} TONY (ERC20.approve)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 1.5 }}>
                    <strong style={{ color: '#00cec9' }}>Tx 2:</strong> Create Product (contract.createProduct)
                  </Typography>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(108, 92, 231, 0.1)' }}>
                    <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 0.5 }}>
                      <strong style={{ color: '#fff' }}>Name:</strong> {name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 0.5 }}>
                      <strong style={{ color: '#fff' }}>Price:</strong> {price} TONY
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 0.5 }}>
                      <strong style={{ color: '#fff' }}>Listing Fee:</strong> {LISTING_FEE_TONY} TONY
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b8b8d4' }}>
                      <strong style={{ color: '#fff' }}>Storage:</strong> IPFS (Pinata)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => prev - 1)}
                sx={{ color: '#b8b8d4' }}
              >
                Back
              </Button>
              {activeStep < 2 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    background: 'linear-gradient(135deg, #6c5ce7, #4a3db5)',
                    boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)',
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={loading || success}
                  className="btn-glow"
                  sx={{
                    background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
                    boxShadow: '0 4px 20px rgba(108, 92, 231, 0.4)',
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Product'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
