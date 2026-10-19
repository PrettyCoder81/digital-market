import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface HeroProps {
  onNavigate: (page: any) => void;
}

export default function HeroSection({ onNavigate }: HeroProps) {
  return (
    <Box className="hero-section">
      <div className="hero-bg" />
      
      {/* Animated orbs */}
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.2) 0%, transparent 70%)',
          top: '10%',
          left: '-5%',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 206, 201, 0.15) 0%, transparent 70%)',
          bottom: '10%',
          right: '-3%',
          animation: 'float-delayed 10s ease-in-out infinite',
        }}
      />

      {/* 3D Cube */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: '5%', lg: '10%' },
          top: '50%',
          transform: 'translateY(-50%)',
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <div className="cube-container">
          <div className="cube">
            <div className="cube-face cube-face-front">🏪</div>
            <div className="cube-face cube-face-back">💎</div>
            <div className="cube-face cube-face-right">🔗</div>
            <div className="cube-face cube-face-left">🎨</div>
            <div className="cube-face cube-face-top">⚡</div>
            <div className="cube-face cube-face-bottom">🌐</div>
          </div>
        </div>
      </Box>

      {/* Orbit rings */}
      <Box
        className="orbit-ring"
        sx={{
          width: 500,
          height: 500,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.3,
        }}
      />
      <Box
        className="orbit-ring"
        sx={{
          width: 700,
          height: 700,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.15,
          animationDuration: '30s',
          animationDirection: 'reverse',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ maxWidth: 700 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: '50px',
              background: 'rgba(108, 92, 231, 0.15)',
              border: '1px solid rgba(108, 92, 231, 0.3)',
              mb: 3,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 16, color: '#a29bfe' }} />
            <Typography variant="body2" sx={{ color: '#a29bfe', fontWeight: 500 }}>
              Powered by Ethereum Sepolia
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 3,
            }}
          >
            The Future of{' '}
            <span className="gradient-text">Digital Commerce</span>
            <br />
            is <span className="gradient-text-2">Decentralized</span>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#b8b8d4',
              fontWeight: 400,
              mb: 4,
              maxWidth: 550,
              lineHeight: 1.7,
            }}
          >
            Buy, sell, and trade digital assets on a fully decentralized marketplace. 
            Powered by blockchain technology with TonysCoin payments and IPFS storage.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => onNavigate('marketplace')}
              className="btn-glow"
              sx={{
                background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                boxShadow: '0 10px 40px rgba(108, 92, 231, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c6cf7, #10ded9)',
                  boxShadow: '0 15px 50px rgba(108, 92, 231, 0.5)',
                },
              }}
            >
              Explore Marketplace
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => onNavigate('create')}
              sx={{
                borderColor: 'rgba(108, 92, 231, 0.5)',
                color: '#a29bfe',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  borderColor: '#6c5ce7',
                  background: 'rgba(108, 92, 231, 0.1)',
                },
              }}
            >
              List Your Product
            </Button>
          </Box>

          {/* Stats mini */}
          <Box sx={{ display: 'flex', gap: 4, mt: 6 }}>
            {[
              { value: '100%', label: 'Decentralized' },
              { value: 'IPFS', label: 'Storage' },
              { value: 'ERC20', label: 'Payments' },
            ].map((stat) => (
              <Box key={stat.label}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: '#00cec9' }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b8b8d4' }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
