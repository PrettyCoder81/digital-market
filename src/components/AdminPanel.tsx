import React, { useState } from 'react';
import {
  Box, Typography, Container, Card, CardContent, Button, TextField,
  Alert, CircularProgress, Chip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import WithdrawIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function AdminPanel() {
  const [newListingFee, setNewListingFee] = useState('');
  const [newPlatformFee, setNewPlatformFee] = useState('');
  const [withdrawRecipient, setWithdrawRecipient] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSetListingFee = async () => {
    setLoading('listingFee');
    setError('');
    setSuccess('');
    try {
      // In production: POST /api/admin/set-listing-fee
      // Backend uses ADMIN_PRIVATE_KEY to sign setListingFee(newFee)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(`Listing fee updated to ${newListingFee} TONY (wei)`);
    } catch (err: any) {
      setError(err.message || 'Failed to update listing fee');
    } finally {
      setLoading('');
    }
  };

  const handleSetPlatformFee = async () => {
    setLoading('platformFee');
    setError('');
    setSuccess('');
    try {
      // In production: POST /api/admin/set-platform-fee
      // Backend uses ADMIN_PRIVATE_KEY to sign setPlatformFee(newFeeBps)
      // Note: fee is in basis points (500 = 5%, 1000 = 10%)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(`Platform fee updated to ${newPlatformFee} bps (${Number(newPlatformFee) / 100}%)`);
    } catch (err: any) {
      setError(err.message || 'Failed to update platform fee');
    } finally {
      setLoading('');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawRecipient || !withdrawRecipient.startsWith('0x')) {
      setError('Please enter a valid recipient address');
      return;
    }
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setLoading('withdraw');
    setError('');
    setSuccess('');
    try {
      // In production: POST /api/admin/withdraw
      // Backend uses ADMIN_PRIVATE_KEY to sign withdrawPlatformFees(recipient, amount)
      // Contract signature: withdrawPlatformFees(address recipient, uint256 amount)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(`Successfully withdrew ${withdrawAmount} TONY to ${withdrawRecipient.slice(0, 10)}...`);
    } catch (err: any) {
      setError(err.message || 'Failed to withdraw fees');
    } finally {
      setLoading('');
    }
  };

  const stats = [
    { label: 'Total Products', value: '2,847', icon: <InventoryIcon />, color: '#6c5ce7' },
    { label: 'Total Sales', value: '156', icon: <TrendingUpIcon />, color: '#00cec9' },
    { label: 'Accrued Fees', value: '4,520 TONY', icon: <WithdrawIcon />, color: '#fd79a8' },
    { label: 'Active Users', value: '1,234', icon: <PeopleIcon />, color: '#55efc4' },
  ];

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#6c5ce7', fontWeight: 600, letterSpacing: 3 }}>
            ADMIN PANEL
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
            Platform <span className="gradient-text">Management</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#b8b8d4', mt: 1 }}>
            Manage marketplace settings, fees, and withdraw accrued platform fees. All admin actions are signed by the backend using ADMIN_PRIVATE_KEY.
          </Typography>
        </Box>

        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

        {/* Stats */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
          {stats.map((stat) => (
            <Box key={stat.label} sx={{ flex: '1 1 200px' }}>
              <Card sx={{ background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.12)' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#b8b8d4' }}>{stat.label}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Listing Fee */}
          <Card sx={{ flex: '1 1 350px', background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.12)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <SettingsIcon sx={{ color: '#6c5ce7' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Set Listing Fee</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 2 }}>
                The fee (in TonysCoin wei) required to list a new product. Default: 10 * 10^18 (10 TONY).
              </Typography>
              <TextField
                label="New Listing Fee (wei)"
                value={newListingFee}
                onChange={(e) => setNewListingFee(e.target.value)}
                fullWidth
                type="number"
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleSetListingFee}
                disabled={loading === 'listingFee'}
                sx={{ background: 'linear-gradient(135deg, #6c5ce7, #4a3db5)' }}
              >
                {loading === 'listingFee' ? <CircularProgress size={24} /> : 'Update Listing Fee'}
              </Button>
              <Typography variant="caption" sx={{ color: '#b8b8d4', mt: 1, display: 'block' }}>
                Contract: setListingFee(uint256 newFee)
              </Typography>
            </CardContent>
          </Card>

          {/* Platform Fee */}
          <Card sx={{ flex: '1 1 350px', background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.12)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TrendingUpIcon sx={{ color: '#00cec9' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Set Platform Fee</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 2 }}>
                Fee in basis points (bps). 500 = 5%, 1000 = 10%. Max: 10,000 bps (100%).
              </Typography>
              <TextField
                label="New Fee (basis points)"
                value={newPlatformFee}
                onChange={(e) => setNewPlatformFee(e.target.value)}
                fullWidth
                type="number"
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleSetPlatformFee}
                disabled={loading === 'platformFee'}
                sx={{ background: 'linear-gradient(135deg, #00cec9, #009688)' }}
              >
                {loading === 'platformFee' ? <CircularProgress size={24} /> : 'Update Platform Fee'}
              </Button>
              <Typography variant="caption" sx={{ color: '#b8b8d4', mt: 1, display: 'block' }}>
                Contract: setPlatformFee(uint256 newFeeBps)
              </Typography>
            </CardContent>
          </Card>

          {/* Withdraw */}
          <Card sx={{ flex: '1 1 350px', background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.12)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <WithdrawIcon sx={{ color: '#fd79a8' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Withdraw Fees</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#b8b8d4', mb: 2 }}>
                Withdraw accrued platform fees. Specify recipient address and amount (in wei).
              </Typography>
              <Box sx={{ background: 'rgba(253, 121, 168, 0.1)', borderRadius: '12px', p: 2, mb: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#b8b8d4' }}>Accrued Platform Fees</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fd79a8' }}>4,520 TONY</Typography>
              </Box>
              <TextField
                label="Recipient Address"
                value={withdrawRecipient}
                onChange={(e) => setWithdrawRecipient(e.target.value)}
                fullWidth
                placeholder="0x..."
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              <TextField
                label="Amount (wei)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                fullWidth
                type="number"
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleWithdraw}
                disabled={loading === 'withdraw'}
                sx={{ background: 'linear-gradient(135deg, #fd79a8, #e84393)' }}
              >
                {loading === 'withdraw' ? <CircularProgress size={24} /> : 'Withdraw Fees'}
              </Button>
              <Typography variant="caption" sx={{ color: '#b8b8d4', mt: 1, display: 'block' }}>
                Contract: withdrawPlatformFees(address recipient, uint256 amount)
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Contract Info */}
        <Card sx={{ mt: 4, background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.12)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon sx={{ color: '#a29bfe' }} />
              Contract Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#b8b8d4' }}>Marketplace Contract</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  0xD0416f8178af9FD7534BB7db9C8cBDD246130D77
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#b8b8d4' }}>TonysCoin (ERC20)</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  0x0C3fE514a1977ea6521d705171Ebcb916ABD28Be
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#b8b8d4' }}>Network</Typography>
                <Typography variant="body2">
                  <Chip label="Ethereum Sepolia" size="small" sx={{ background: 'rgba(0, 206, 201, 0.2)', color: '#00cec9' }} />
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#b8b8d4' }}>Solidity Version</Typography>
                <Typography variant="body2">
                  <Chip label="^0.8.24" size="small" sx={{ background: 'rgba(108, 92, 231, 0.2)', color: '#a29bfe' }} />
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
