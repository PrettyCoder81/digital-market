import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Chip, IconButton, Menu, MenuItem, Divider, CircularProgress,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CodeIcon from '@mui/icons-material/Code';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useWallet } from '../context/WalletContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: any) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { address, isConnected, isCorrectNetwork, isConnecting, connect, disconnect, switchToSepolia, shortAddress, balance } = useWallet();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
        {/* Logo */}
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

        {/* Navigation */}
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
            startIcon={<AddCircleIcon />}
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

        {/* Wallet Connection */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Network Status */}
          {isConnected && !isCorrectNetwork && (
            <Chip
              icon={<SwapVertIcon />}
              label="Wrong Network"
              onClick={switchToSepolia}
              sx={{
                background: 'rgba(253, 121, 168, 0.15)',
                color: '#fd79a8',
                border: '1px solid rgba(253, 121, 168, 0.3)',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': {
                  background: 'rgba(253, 121, 168, 0.25)',
                },
              }}
            />
          )}

          {isConnected && isCorrectNetwork && (
            <Chip
              label="Sepolia"
              size="small"
              sx={{
                background: 'rgba(0, 206, 201, 0.15)',
                color: '#00cec9',
                border: '1px solid rgba(0, 206, 201, 0.3)',
                fontWeight: 600,
              }}
            />
          )}

          {/* Connect Wallet Button */}
          {!isConnected ? (
            <Button
              variant="contained"
              startIcon={isConnecting ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWalletIcon />}
              onClick={connect}
              disabled={isConnecting}
              className="btn-glow"
              sx={{
                background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
                boxShadow: '0 4px 15px rgba(108, 92, 231, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c6cf7, #10ded9)',
                  boxShadow: '0 6px 20px rgba(108, 92, 231, 0.5)',
                },
              }}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleMenuOpen}
                sx={{
                  borderRadius: '12px',
                  background: 'rgba(108, 92, 231, 0.15)',
                  border: '1px solid rgba(108, 92, 231, 0.3)',
                  color: '#fff',
                  px: 2,
                  py: 0.75,
                  '&:hover': {
                    background: 'rgba(108, 92, 231, 0.25)',
                    borderColor: 'rgba(108, 92, 231, 0.5)',
                  },
                }}
                startIcon={<AccountBalanceWalletIcon sx={{ color: '#a29bfe' }} />}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {shortAddress}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b8b8d4', fontSize: '0.7rem' }}>
                    {balance} ETH
                  </Typography>
                </Box>
              </Button>

              {/* Wallet Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                slotProps={{
                  paper: {
                    sx: {
                      background: 'rgba(18, 18, 42, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(108, 92, 231, 0.2)',
                      borderRadius: '12px',
                      mt: 1,
                      minWidth: 250,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 0.5 }}>
                    Connected Wallet
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#fff', wordBreak: 'break-all' }}>
                    {address}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(108, 92, 231, 0.15)' }} />
                <MenuItem onClick={handleCopyAddress} sx={{ py: 1.5 }}>
                  <ContentCopyIcon sx={{ mr: 1.5, fontSize: 20, color: '#a29bfe' }} />
                  <Typography variant="body2">
                    {copied ? 'Copied!' : 'Copy Address'}
                  </Typography>
                </MenuItem>
                {!isCorrectNetwork && (
                  <MenuItem onClick={() => { switchToSepolia(); handleMenuClose(); }} sx={{ py: 1.5 }}>
                    <SwapVertIcon sx={{ mr: 1.5, fontSize: 20, color: '#fd79a8' }} />
                    <Typography variant="body2" sx={{ color: '#fd79a8' }}>
                      Switch to Sepolia
                    </Typography>
                  </MenuItem>
                )}
                <Divider sx={{ borderColor: 'rgba(108, 92, 231, 0.15)' }} />
                <MenuItem onClick={() => { disconnect(); handleMenuClose(); }} sx={{ py: 1.5 }}>
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: '#fd79a8' }} />
                  <Typography variant="body2" sx={{ color: '#fd79a8' }}>
                    Disconnect
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
