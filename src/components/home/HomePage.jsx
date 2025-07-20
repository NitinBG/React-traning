import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingProducts from './TrendingProducts';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Welcome to Fashion Store
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4 }}>
            Discover the latest trends in fashion and get the best deals on premium clothing
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/products')}
            sx={{ px: 4, py: 1.5 }}
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* Trending Products Section */}
      <TrendingProducts />
    </Box>
  );
};

export default HomePage; 