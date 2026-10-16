import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Typography,
  IconButton,
} from '@mui/material';
import { SwapHoriz, Close, AdminPanelSettings, Person } from '@mui/icons-material';
import { useMarketplace, MOCK_WALLETS } from '../context/MarketplaceContext';

export default function WalletSwitcher() {
  const { connectedAccount, isConnected, switchWallet, isOwner } = useMarketplace();
  const [open, setOpen] = useState(false);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSwitch = (address: string) => {
    switchWallet(address);
    setOpen(false);
  };

  if (!isConnected) return null;

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<SwapHoriz />}
        onClick={() => setOpen(true)}
        sx={{ ml: 1 }}
      >
        Switch Wallet
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: { sx: { maxWidth: 500, width: '100%' } }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Switch Wallet</Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a wallet to test different user roles and permissions
          </Typography>
          <List>
            {MOCK_WALLETS.map((wallet) => {
              const isSelected = connectedAccount === wallet.address;
              const isAdmin = wallet.address.toLowerCase() === MOCK_WALLETS[0].address.toLowerCase();

              return (
                <ListItem key={wallet.address} disablePadding>
                  <ListItemButton
                    onClick={() => handleSwitch(wallet.address)}
                    selected={isSelected}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      bgcolor: isSelected ? 'action.selected' : 'background.paper',
                    }}
                  >
                    <Box sx={{ mr: 2 }}>
                      {isAdmin ? (
                        <AdminPanelSettings sx={{ color: 'primary.main' }} />
                      ) : (
                        <Person />
                      )}
                    </Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">{wallet.name}</Typography>
                          {isAdmin && (
                            <Chip
                              label="Owner"
                              size="small"
                              color="primary"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                          {isSelected && (
                            <Chip
                              label="Active"
                              size="small"
                              color="success"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                        >
                          {shortenAddress(wallet.address)}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
