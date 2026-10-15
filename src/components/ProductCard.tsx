import React from 'react';
import {
  Card, CardContent, CardMedia, Typography, Button, Box, Chip, CardActions, Skeleton
} from '@mui/material';
import { ShoppingCart, Visibility, Lock } from '@mui/icons-material';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onPurchase: (product: Product) => void;
  isOwned: boolean;
  isConnected: boolean;
}

export default function ProductCard({ product, onView, onPurchase, isOwned, isConnected }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(145deg, rgba(26,26,46,0.8) 0%, rgba(15,15,26,0.9) 100%)',
        border: '1px solid rgba(124,58,237,0.15)',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          border: '1px solid rgba(124,58,237,0.4)',
          boxShadow: '0 20px 40px rgba(124,58,237,0.15)',
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {!imageLoaded && (
          <Skeleton variant="rectangular" sx={{ height: 220, width: '100%' }} />
        )}
        <CardMedia
          component="img"
          height="220"
          image={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          sx={{
            display: imageLoaded ? 'block' : 'none',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        />
        <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 0.5,
        }}>
          <Chip
            label={product.category}
            size="small"
            sx={{
              bgcolor: 'rgba(124,58,237,0.8)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
          {isOwned && (
            <Chip
              icon={<Lock sx={{ fontSize: 14 }} />}
              label="Owned"
              size="small"
              color="success"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, fontSize: '1rem' }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          mb: 2,
        }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Price</Typography>
            <Typography variant="h6" sx={{
              fontWeight: 800,
              background: product.isForSale
                ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                : 'linear-gradient(135deg, #666, #999)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {product.price} ETH
            </Typography>
          </Box>
          {product.isForSale ? (
            <Chip label="For Sale" color="success" size="small" sx={{ fontWeight: 600 }} />
          ) : (
            <Chip label="Not Listed" color="default" size="small" />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Visibility />}
          onClick={() => onView(product)}
          sx={{ flex: 1 }}
        >
          View
        </Button>
        {product.isForSale && !isOwned && (
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCart />}
            onClick={() => onPurchase(product)}
            disabled={!isConnected}
            sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #0891b2)' },
            }}
          >
            Buy
          </Button>
        )}
        {isOwned && (
          <Button
            variant="contained"
            size="small"
            onClick={() => onView(product)}
            sx={{ flex: 1, bgcolor: 'success.main' }}
          >
            Manage
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
