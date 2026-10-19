import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Chip,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CodeIcon from '@mui/icons-material/Code';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: any) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'rgba(10, 10, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108, 92, 231, 0.15)',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          onClick={() => onNavigate('home')}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StorefrontIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff, #a29bfe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Digital Market
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color={currentPage === 'marketplace' ? 'primary' : 'inherit'}
            onClick={() => onNavigate('marketplace')}
            startIcon={<StorefrontIcon />}
            sx={{
              borderRadius: '10px',
              background: currentPage === 'marketplace' ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
            }}
          >
            Marketplace
          </Button>
          <Button
            color={currentPage === 'create' ? 'primary' : 'inherit'}
            onClick={() => onNavigate('create')}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              borderRadius: '10px',
              background: currentPage === 'create' ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'inline' } }}>Create</Box>
          </Button>
          <Button
            color={currentPage === 'admin' ? 'primary' : 'inherit'}
            onClick={() => onNavigate('admin')}
            startIcon={<DashboardIcon />}
            sx={{
              borderRadius: '10px',
              background: currentPage === 'admin' ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'inline' } }}>Admin</Box>
          </Button>
          <Button
            color={currentPage === 'docs' ? 'primary' : 'inherit'}
            onClick={() => onNavigate('docs')}
            startIcon={<CodeIcon />}
            sx={{
              borderRadius: '10px',
              background: currentPage === 'docs' ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'inline' } }}>Code</Box>
          </Button>
        </Box>

        <Chip
          icon={<AccountBalanceWalletIcon />}
          label="Sepolia"
          size="small"
          sx={{
            background: 'rgba(0, 206, 201, 0.15)',
            color: '#00cec9',
            border: '1px solid rgba(0, 206, 201, 0.3)',
            fontWeight: 600,
          }}
        />
      </Toolbar>
    </AppBar>
  );
}
