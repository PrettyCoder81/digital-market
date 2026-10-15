import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button, Alert,
  Divider, Chip, IconButton, Tooltip
} from '@mui/material';
import {
  AdminPanelSettings, AccountBalance, Percent, MoveToInbox,
  TrendingUp, Shield
} from '@mui/icons-material';
import { useMarketplace } from '../context/MarketplaceContext';

export default function AdminPanel() {
  const {
    platformFee, contractBalance, isOwner, withdrawFunds, updatePlatformFee,
    products, transactions
  } = useMarketplace();

  const [newFee, setNewFee] = useState(platformFee.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  if (!isOwner) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Shield sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>Access Denied</Typography>
        <Typography color="text.secondary">Only the marketplace owner can access this panel.</Typography>
      </Box>
    );
  }

  const handleUpdateFee = () => {
    const fee = parseFloat(newFee);
    if (isNaN(fee) || fee < 0 || fee > 25) {
      setError('Fee must be between 0 and 25%');
      return;
    }
    setLoading(true);
    setError('');
    try {
      updatePlatformFee(fee);
      setSuccess(`Platform fee updated to ${fee}%`);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    setError('');
    try {
      await withdrawFunds();
      setSuccess('Funds withdrawn successfully!');
    } catch (err: any) {
      setError(err.message);
    }
    setWithdrawing(false);
  };

  const totalSales = transactions.filter(t => t.type === 'purchase').length;
  const totalVolume = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + parseFloat(t.price), 0);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <AdminPanelSettings sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Admin Panel</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage marketplace settings and withdraw funds
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TrendingUp color="primary" />
              <Typography variant="caption" color="text.secondary">Total Sales</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{totalSales}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AccountBalance color="secondary" />
              <Typography variant="caption" color="text.secondary">Total Volume</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{totalVolume.toFixed(2)} ETH</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200, bgcolor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Percent sx={{ color: 'success.main' }} />
              <Typography variant="caption" color="text.secondary">Platform Fee</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{platformFee}%</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Contract Balance & Withdraw */}
      <Card sx={{ mb: 3, border: '1px solid rgba(124,58,237,0.2)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Contract Balance
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'rgba(124,58,237,0.05)',
            borderRadius: 2,
            mb: 2,
          }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Available Balance</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {contractBalance} ETH
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={withdrawing ? <></> : <MoveToInbox />}
              onClick={handleWithdraw}
              disabled={withdrawing || parseFloat(contractBalance) === 0}
              sx={{
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                '&:hover': { background: 'linear-gradient(135deg, #059669, #0891b2)' },
              }}
            >
              {withdrawing ? 'Withdrawing...' : 'Withdraw All'}
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Platform fees collected from all transactions. Only the owner can withdraw.
          </Typography>
        </CardContent>
      </Card>

      {/* Update Platform Fee */}
      <Card sx={{ border: '1px solid rgba(124,58,237,0.2)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Update Platform Fee
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              label="Platform Fee (%)"
              type="number"
              value={newFee}
              onChange={(e) => setNewFee(e.target.value)}
              sx={{ flex: 1 }}
              helperText="Fee must be between 0% and 25%"
            />
            <Button
              variant="contained"
              onClick={handleUpdateFee}
              disabled={loading}
              sx={{
                height: 56,
                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #0891b2)' },
              }}
            >
              Update Fee
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Chip label={`Current: ${platformFee}%`} color="primary" sx={{ mr: 1 }} />
            <Chip label={`Products: ${products.length}`} variant="outlined" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
