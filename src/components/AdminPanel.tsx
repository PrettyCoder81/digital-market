import React, { useState } from 'react';
import {
  Box, Typography, Container, Card, CardContent, Button, TextField,
  Alert, CircularProgress, Divider, Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import WithdrawIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';

export default function AdminPanel() {
  const [newListingFee, setNewListingFee] = useState('');
  const [newPlatformFee, setNewPlatformFee] = useState('');
  const [loading, setLoading] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSetListingFee = async () => {
    setLoading('listingFee');
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Listing fee updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update listing fee');
    } finally {
      setLoading('');
    }
  };

  const handleSetPlatformFee = async () => {
    setLoading('platformFee');
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Platform fee updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update platform fee');
    } finally {
      setLoading('');
    }
  };

  const handleWithdraw = async () => {
    setLoading('withdraw');
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Platform fees withdrawn successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to withdraw fees');
    } finally {
      setLoading('');
    }
  };

  const stats = [
    { label: 'Total Products', value: '2,847', icon: <InventoryIcon />, color: '#6c5ce7' },
    { label: 'Total Sales', value: '156', icon: <TrendingUpIcon />, color: '#00cec9' },
    { label: 'Platform Fees', value: '4,520 TONY', icon: <WithdrawIcon />, color: '#fd79a8' },
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
            Manage marketplace settings, fees, and withdraw accrued platform fees.
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
                The fee (in TonysCoin) required to list a new product on the marketplace.
              </Typography>
              <TextField
                label="New Listing Fee (TONY)"
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
                The percentage fee taken from each sale (currently 5%).
              </Typography>
              <TextField
                label="New Platform Fee (%)"
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
                Withdraw all accrued platform fees to the admin wallet.
              </Typography>
              <Box sx={{ background: 'rgba(253, 121, 168, 0.1)', borderRadius: '12px', p: 2, mb: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#b8b8d4' }}>Available to Withdraw</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fd79a8' }}>4,520 TONY</Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleWithdraw}
                disabled={loading === 'withdraw'}
                sx={{ background: 'linear-gradient(135deg, #fd79a8, #e84393)' }}
              >
                {loading === 'withdraw' ? <CircularProgress size={24} /> : 'Withdraw All Fees'}
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Contract Info */}
        <Card sx={{ mt: 4, background: 'rgba(18, 18, 42, 0.8)', border: '1px solid rgba(108, 92, 231, 0.12)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Contract Information</Typography>
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
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
