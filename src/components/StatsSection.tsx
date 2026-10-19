import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import TokenIcon from '@mui/icons-material/Token';
import VerifiedIcon from '@mui/icons-material/Verified';

const stats = [
  { icon: <ShoppingCartIcon sx={{ fontSize: 28 }} />, value: '2,847', label: 'Products Listed', color: '#6c5ce7' },
  { icon: <PeopleIcon sx={{ fontSize: 28 }} />, value: '1,234', label: 'Active Users', color: '#00cec9' },
  { icon: <TokenIcon sx={{ fontSize: 28 }} />, value: '45.2K', label: 'TonysCoin Volume', color: '#fd79a8' },
  { icon: <VerifiedIcon sx={{ fontSize: 28 }} />, value: '100%', label: 'On-Chain Verified', color: '#55efc4' },
];

export default function StatsSection() {
  return (
    <Box sx={{ py: 8, position: 'relative' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {stats.map((stat) => (
            <Box key={stat.label} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Card
                className="product-card"
                sx={{
                  background: 'rgba(18, 18, 42, 0.8)',
                  border: '1px solid rgba(108, 92, 231, 0.15)',
                  textAlign: 'center',
                  py: 3,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      background: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b8b8d4' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
