import React, { useState, useMemo } from 'react';
import {
  Box, Container, Typography, TextField, InputAdornment, Chip,
  Select, MenuItem, FormControl, InputLabel, CircularProgress,
  Snackbar, Alert, Paper
} from '@mui/material';
import {
  Search, FilterList, Store, ShoppingCart, TrendingUp, People
} from '@mui/icons-material';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import AdminPanel from './components/AdminPanel';
import TransactionsPanel from './components/TransactionsPanel';
import ContractInfo from './components/ContractInfo';
import { Product } from './types';
import { categories } from './data/products';

function MarketplaceContent() {
  const {
    products, isConnected, connectedAccount, isProductOwner
  } = useMarketplace();

  const [currentView, setCurrentView] = useState('marketplace');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (currentView === 'my-items') {
      filtered = filtered.filter(p => isProductOwner(p.id));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, currentView, isProductOwner]);

  const handleViewProduct = (product: Product) => {
    setSelectedProductId(product.id);
  };

  const handlePurchase = async (product: Product) => {
    setSelectedProductId(product.id);
  };

  const handleCloseDetail = () => {
    setSelectedProductId(null);
  };

  const handleAdminClick = () => {
    setCurrentView('admin');
  };

  const handleTransactionsClick = () => {
    setCurrentView('transactions');
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(6,182,212,0.05) 0%, transparent 50%)',
    }}>
      <Navbar
        onAdminClick={handleAdminClick}
        onTransactionsClick={handleTransactionsClick}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {currentView === 'admin' ? (
          <AdminPanel />
        ) : currentView === 'transactions' ? (
          <TransactionsPanel />
        ) : (
          <>
            {/* Hero Section */}
            {currentView === 'marketplace' && (
              <Paper
                elevation={0}
                sx={{
                  mb: 4,
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.08) 100%)',
                  border: '1px solid rgba(124,58,237,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
                }} />
                <Box sx={{ position: 'relative' }}>
                  <Typography variant="h3" sx={{
                    fontWeight: 800,
                    mb: 1,
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                  }}>
                    Digital Marketplace
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
                    Discover, purchase, and trade unique digital assets powered by blockchain technology.
                    Every transaction is secured on-chain.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Store color="primary" />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{products.length}</Typography>
                        <Typography variant="caption" color="text.secondary">Products</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShoppingCart color="secondary" />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{products.filter(p => p.isForSale).length}</Typography>
                        <Typography variant="caption" color="text.secondary">For Sale</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp sx={{ color: 'success.main' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>5%</Typography>
                        <Typography variant="caption" color="text.secondary">Platform Fee</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Filters */}
            <Box sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <TextField
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ minWidth: 250, flex: { xs: 1, md: 'unset' } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }
                }}
              />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Chip
                label={`${filteredProducts.length} items`}
                color="primary"
                variant="outlined"
                icon={<FilterList />}
              />
            </Box>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {currentView === 'my-items' ? "You don't own any items yet" : 'No products found'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentView === 'my-items'
                    ? 'Purchase a product to see it here.'
                    : 'Try adjusting your search or filters.'}
                </Typography>
              </Box>
            ) : (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={handleViewProduct}
                    onPurchase={handlePurchase}
                    isOwned={isProductOwner(product.id)}
                    isConnected={isConnected}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Product Detail Dialog */}
      <ProductDetail
        productId={selectedProductId}
        onClose={handleCloseDetail}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Contract Info */}
      {currentView !== 'admin' && currentView !== 'transactions' && (
        <Container maxWidth="xl">
          <ContractInfo />
        </Container>
      )}

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 4,
          borderTop: '1px solid rgba(124,58,237,0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Digital Marketplace © 2026 — Powered by Ethereum & IPFS
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Smart Contract: Solidity | Frontend: React + MUI | Storage: IPFS via Pinata
        </Typography>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
}
