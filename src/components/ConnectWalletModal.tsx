import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, Box, Typography, Button, IconButton, Divider, Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useWallet } from '../context/WalletContext';

interface ConnectWalletModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ConnectWalletModal({ open, onClose }: ConnectWalletModalProps) {
  const { connect, isConnecting, isConnected, isCorrectNetwork, shortAddress } = useWallet();

  const handleConnect = async () => {
    await connect();
    if (isConnected) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            background: 'rgba(18, 18, 42, 0.98)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(108, 92, 231, 0.2)',
            borderRadius: '24px',
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Connect Wallet
          </Typography>
          <Typography variant="body2" sx={{ color: '#b8b8d4', mt: 0.5 }}>
            Choose your preferred wallet to connect
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#b8b8d4' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* MetaMask Option */}
        <Box
          onClick={handleConnect}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid rgba(108, 92, 231, 0.2)',
            background: 'rgba(108, 92, 231, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            mb: 2,
            '&:hover': {
              borderColor: '#6c5ce7',
              background: 'rgba(108, 92, 231, 0.1)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f6851b, #e2761b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: 24 }}>🦊</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              MetaMask
            </Typography>
            <Typography variant="body2" sx={{ color: '#b8b8d4' }}>
              Connect using your MetaMask wallet
            </Typography>
          </Box>
          <Chip
            label="Popular"
            size="small"
            sx={{
              background: 'rgba(108, 92, 231, 0.2)',
              color: '#a29bfe',
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Other Wallets */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2.5,
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(255, 255, 255, 0.02)',
            opacity: 0.5,
            cursor: 'not-allowed',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AccountBalanceWalletIcon sx={{ color: '#b8b8d4' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#b8b8d4' }}>
              WalletConnect
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Coming soon
            </Typography>
          </Box>
          <Chip label="Soon" size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: '#666' }} />
        </Box>

        <Divider sx={{ borderColor: 'rgba(108, 92, 231, 0.1)', my: 3 }} />

        {/* Info */}
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <ShieldIcon sx={{ color: '#6c5ce7', mb: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#b8b8d4', display: 'block' }}>
              Secure
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <SpeedIcon sx={{ color: '#00cec9', mb: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#b8b8d4', display: 'block' }}>
              Fast
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <VerifiedIcon sx={{ color: '#55efc4', mb: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#b8b8d4', display: 'block' }}>
              Trusted
            </Typography>
          </Box>
        </Box>

        {/* Network Info */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: '12px',
            background: 'rgba(0, 206, 201, 0.05)',
            border: '1px solid rgba(0, 206, 201, 0.15)',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#b8b8d4' }}>
            This app uses <strong style={{ color: '#00cec9' }}>Ethereum Sepolia</strong> testnet
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
