import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SecurityIcon from '@mui/icons-material/Security';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const steps = [
  {
    icon: <CloudUploadIcon sx={{ fontSize: 40 }} />,
    title: 'Upload to IPFS',
    description: 'Product images are stored on IPFS via Pinata, ensuring decentralized, permanent storage.',
    color: '#6c5ce7',
    step: '01',
  },
  {
    icon: <LocalOfferIcon sx={{ fontSize: 40 }} />,
    title: 'List on Blockchain',
    description: 'Pay a small listing fee in TonysCoin and your product is immutably recorded on Ethereum.',
    color: '#00cec9',
    step: '02',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Secure Transactions',
    description: 'All purchases use ERC20 token approvals with 5% platform fee. Fully transparent on-chain.',
    color: '#fd79a8',
    step: '03',
  },
  {
    icon: <SwapHorizIcon sx={{ fontSize: 40 }} />,
    title: 'Transfer Ownership',
    description: 'Product ownership is transferred on-chain. Owners can freely transfer to any address.',
    color: '#55efc4',
    step: '04',
  },
];

export default function HowItWorks() {
  return (
    <Box sx={{ py: 10, position: 'relative' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#6c5ce7', fontWeight: 600, letterSpacing: 3, fontSize: '0.875rem' }}>
            HOW IT WORKS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Seamless <span className="gradient-text">Blockchain Commerce</span>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {steps.map((step) => (
            <Box
              key={step.step}
              sx={{
                flex: '1 1 240px',
                maxWidth: '280px',
                position: 'relative',
                p: 3,
                borderRadius: '20px',
                background: 'rgba(18, 18, 42, 0.6)',
                border: '1px solid rgba(108, 92, 231, 0.1)',
                transition: 'all 0.4s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  borderColor: `${step.color}40`,
                  boxShadow: `0 20px 40px ${step.color}15`,
                },
              }}
            >
              <Typography
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: 20,
                  fontSize: '4rem',
                  fontWeight: 900,
                  color: `${step.color}15`,
                  lineHeight: 1,
                }}
              >
                {step.step}
              </Typography>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '20px',
                  background: `${step.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: step.color,
                  mb: 2.5,
                }}
              >
                {step.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {step.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b8b8d4', lineHeight: 1.7 }}>
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
