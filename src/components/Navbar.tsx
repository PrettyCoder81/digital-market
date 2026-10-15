import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Chip, IconButton,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider,
  Avatar, Menu, MenuItem, Badge
} from '@mui/material';
import {
  AccountBalanceWallet, Store, AdminPanelSettings, Logout,
  ShoppingCart, Menu as MenuIcon, Dashboard, Receipt
} from '@mui/icons-material';
import { useMarketplace } from '../context/MarketplaceContext';

interface NavbarProps {
  onAdminClick: () => void;
  onTransactionsClick: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Navbar({ onAdminClick, onTransactionsClick, currentView, onViewChange }: NavbarProps) {
  const { connectedAccount, isConnected, connectWallet, disconnectWallet, isOwner, transactions } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <>
      <AppBar position="sticky" sx={{
        background: 'linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(26,26,46,0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(124,58,237,0.2)',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Store sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h6" sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' },
            }}>
              Digital Marketplace
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              color={currentView === 'marketplace' ? 'primary' : 'inherit'}
              onClick={() => onViewChange('marketplace')}
              startIcon={<ShoppingCart />}
            >
              Marketplace
            </Button>
            <Button
              color={currentView === 'my-items' ? 'primary' : 'inherit'}
              onClick={() => onViewChange('my-items')}
              startIcon={<Dashboard />}
              disabled={!isConnected}
            >
              My Items
            </Button>
            {isOwner && (
              <Button
                color={currentView === 'admin' ? 'primary' : 'inherit'}
                onClick={onAdminClick}
                startIcon={<AdminPanelSettings />}
              >
                Admin
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isConnected && (
              <Badge badgeContent={transactions.length} color="secondary" sx={{ mr: 1 }}>
                <IconButton color="inherit" onClick={onTransactionsClick}>
                  <Receipt />
                </IconButton>
              </Badge>
            )}
            {isConnected ? (
              <>
                <Chip
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{connectedAccount?.[2]}</Avatar>}
                  label={shortenAddress(connectedAccount!)}
                  variant="outlined"
                  color="primary"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ cursor: 'pointer' }}
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem disabled>
                    <Typography variant="caption" color="text.secondary">
                      {connectedAccount}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { disconnectWallet(); setAnchorEl(null); }}>
                    <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                    Disconnect
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<AccountBalanceWallet />}
                onClick={connectWallet}
                sx={{
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #0891b2)' },
                }}
              >
                Connect Wallet
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        slotProps={{
          paper: { sx: { bgcolor: 'background.paper', width: 280 } }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Digital Marketplace
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem onClick={() => { onViewChange('marketplace'); setMobileMenuOpen(false); }} sx={{ cursor: 'pointer' }}>
            <ListItemIcon><ShoppingCart color="primary" /></ListItemIcon>
            <ListItemText primary="Marketplace" />
          </ListItem>
          <ListItem onClick={() => { onViewChange('my-items'); setMobileMenuOpen(false); }} sx={{ cursor: 'pointer' }}>
            <ListItemIcon><Dashboard color="primary" /></ListItemIcon>
            <ListItemText primary="My Items" />
          </ListItem>
          {isOwner && (
            <ListItem onClick={() => { onAdminClick(); setMobileMenuOpen(false); }} sx={{ cursor: 'pointer' }}>
              <ListItemIcon><AdminPanelSettings color="primary" /></ListItemIcon>
              <ListItemText primary="Admin Panel" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
}
