import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import StorefrontIcon from '@mui/icons-material/Storefront';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 6,
        background: 'rgba(10, 10, 26, 0.95)',
        borderTop: '1px solid rgba(108, 92, 231, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 4, mb: 4 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StorefrontIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Digital Market Place
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#b8b8d4', maxWidth: 300 }}>
              A fully decentralized marketplace built on Ethereum Sepolia with TonysCoin payments and IPFS storage.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#a29bfe' }}>
              Technology
            </Typography>
            {['Ethereum Sepolia', 'TonysCoin (ERC20)', 'IPFS via Pinata', 'React + MUI', 'Node.js + Express'].map((item) => (
              <Typography key={item} variant="body2" sx={{ color: '#b8b8d4', mb: 0.5 }}>
                {item}
              </Typography>
            ))}
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#a29bfe' }}>
              Contracts
            </Typography>
            <Typography variant="caption" sx={{ color: '#b8b8d4', display: 'block', mb: 1 }}>
              Marketplace:
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#00cec9', display: 'block', mb: 2, wordBreak: 'break-all' }}>
              0xD0416f8178af9FD7534BB7db9C8cBDD246130D77
            </Typography>
            <Typography variant="caption" sx={{ color: '#b8b8d4', display: 'block', mb: 1 }}>
              TonysCoin:
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#00cec9', display: 'block', wordBreak: 'break-all' }}>
              0x0C3fE514a1977ea6521d705171Ebcb916ABD28Be
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(108, 92, 231, 0.1)', mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#b8b8d4' }}>
            © 2024 Digital Market Place. Built with ❤️ on Ethereum.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <GitHubIcon sx={{ color: '#b8b8d4', cursor: 'pointer', '&:hover': { color: '#fff' } }} />
            <Typography variant="body2" sx={{ color: '#6c5ce7', cursor: 'pointer' }}>
              View on GitHub
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
