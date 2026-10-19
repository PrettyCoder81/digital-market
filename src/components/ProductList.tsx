import React from 'react';
import { Box, Typography, Container, Card, CardContent, CardActionArea, Chip, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

const demoProducts = [
  {
    id: 1,
    name: 'Cyberpunk Art Collection',
    description: 'A stunning collection of cyberpunk-inspired digital art pieces',
    price: '150',
    imageURI: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=300&fit=crop',
    owner: '0x1234...5678',
    listed: true,
    category: 'Digital Art',
    createdAt: Date.now() / 1000 - 86400 * 2,
  },
  {
    id: 2,
    name: '3D Holographic Display',
    description: 'Interactive 3D holographic display framework for web applications',
    price: '500',
    imageURI: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    owner: '0xabcd...ef01',
    listed: true,
    category: 'Software',
    createdAt: Date.now() / 1000 - 86400 * 5,
  },
  {
    id: 3,
    name: 'Neural Network Model',
    description: 'Pre-trained AI model for image generation and manipulation',
    price: '1200',
    imageURI: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    owner: '0x2345...6789',
    listed: true,
    category: 'AI/ML',
    createdAt: Date.now() / 1000 - 86400 * 1,
  },
  {
    id: 4,
    name: 'Blockchain Analytics Tool',
    description: 'Real-time blockchain analytics dashboard with multi-chain support',
    price: '800',
    imageURI: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
    owner: '0x3456...7890',
    listed: true,
    category: 'Tools',
    createdAt: Date.now() / 1000 - 86400 * 3,
  },
  {
    id: 5,
    name: 'Metaverse Land Plot',
    description: 'Premium virtual land in the decentralized metaverse',
    price: '2500',
    imageURI: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop',
    owner: '0x4567...8901',
    listed: true,
    category: 'Virtual Assets',
    createdAt: Date.now() / 1000 - 86400 * 7,
  },
  {
    id: 6,
    name: 'Smart Contract Audit',
    description: 'Professional smart contract security audit service',
    price: '3000',
    imageURI: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    owner: '0x5678...9012',
    listed: true,
    category: 'Services',
    createdAt: Date.now() / 1000 - 86400 * 4,
  },
];

interface ProductListProps {
  onViewProduct: (id: number) => void;
  featured?: boolean;
}

export default function ProductList({ onViewProduct, featured = false }: ProductListProps) {
  const products = featured ? demoProducts.slice(0, 3) : demoProducts;

  return (
    <Box sx={{ py: featured ? 8 : 4, px: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: '#6c5ce7', fontWeight: 600, letterSpacing: 3, fontSize: '0.75rem' }}>
              {featured ? 'FEATURED ITEMS' : 'ALL PRODUCTS'}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {featured ? (
                <>Trending <span className="gradient-text">Digital Assets</span></>
              ) : (
                <>Explore <span className="gradient-text">Marketplace</span></>
              )}
            </Typography>
          </Box>
          {!featured && (
            <Chip label={`${products.length} products`} sx={{ background: 'rgba(108, 92, 231, 0.15)', color: '#a29bfe', fontWeight: 600 }} />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {products.map((product) => (
            <Box key={product.id} sx={{ flex: '1 1 320px', maxWidth: '400px' }}>
              <Card
                className="product-card"
                sx={{
                  background: 'rgba(18, 18, 42, 0.8)',
                  border: '1px solid rgba(108, 92, 231, 0.12)',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={product.imageURI}
                    alt={product.name}
                    sx={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                  />
                  <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,26,0.8) 0%, transparent 50%)' }} />
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{ position: 'absolute', top: 12, left: 12, background: 'rgba(108, 92, 231, 0.9)', color: '#fff', fontWeight: 600 }}
                  />
                  {product.listed && (
                    <Chip
                      label="Listed"
                      size="small"
                      sx={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0, 206, 201, 0.9)', color: '#fff', fontWeight: 600 }}
                    />
                  )}
                </Box>

                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 2 }} noWrap>
                    {product.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon sx={{ fontSize: 16, color: '#b8b8d4' }} />
                    <Typography variant="caption" sx={{ color: '#b8b8d4' }}>
                      {product.owner}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid rgba(108, 92, 231, 0.1)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CurrencyBitcoinIcon sx={{ fontSize: 18, color: '#00cec9' }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#00cec9' }}>
                        {product.price}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b8b8d4' }}>TONY</Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => onViewProduct(product.id)}
                      sx={{ background: 'linear-gradient(135deg, #6c5ce7, #4a3db5)', boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)' }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
