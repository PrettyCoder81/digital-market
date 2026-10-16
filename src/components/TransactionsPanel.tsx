import React from 'react';
import {
  Box, Typography, Card, CardContent, Chip, Divider, List, ListItem,
  ListItemText, ListItemIcon, Avatar
} from '@mui/material';
import {
  Receipt, ShoppingCart, Send, Tag, ArrowForward
} from '@mui/icons-material';
import { useMarketplace } from '../context/MarketplaceContext';
import CopyAddress from './CopyAddress';

export default function TransactionsPanel() {
  const { transactions, products } = useMarketplace();

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <ShoppingCart color="success" />;
      case 'transfer': return <Send color="secondary" />;
      case 'listing': return <Tag color="primary" />;
      default: return <Receipt />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'success';
      case 'transfer': return 'secondary';
      case 'listing': return 'primary';
      default: return 'default';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Receipt sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Transaction History</Typography>
          <Typography variant="body2" color="text.secondary">
            All marketplace transactions
          </Typography>
        </Box>
      </Box>

      {transactions.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6, border: '1px solid rgba(124,58,237,0.2)' }}>
          <CardContent>
            <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No transactions yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Transactions will appear here once purchases or transfers are made.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ border: '1px solid rgba(124,58,237,0.2)' }}>
          <List>
            {transactions.map((tx, index) => (
              <React.Fragment key={tx.id}>
                <ListItem sx={{ px: 3, py: 2 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: `${getTypeColor(tx.type)}.main`, width: 40, height: 40 }}>
                      {getTypeIcon(tx.type)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {getProductName(tx.productId)}
                        </Typography>
                        <Chip
                          label={tx.type}
                          size="small"
                          color={getTypeColor(tx.type) as any}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                          <CopyAddress address={tx.from} shorten={true} size="small" />
                          <ArrowForward sx={{ fontSize: 14, mx: 0.5 }} />
                          <CopyAddress address={tx.to} shorten={true} size="small" />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {formatDate(tx.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    {tx.price !== '0' && (
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {tx.price} ETH
                      </Typography>
                    )}
                  </Box>
                </ListItem>
                {index < transactions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
}
