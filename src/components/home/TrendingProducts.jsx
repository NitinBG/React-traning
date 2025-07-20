import { useQuery, gql } from '@apollo/client';
import { Grid, Container, Typography, Box, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { GET_PRODUCTS } from '../../graphql/productOperations';



const TrendingProducts = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: {
      currentPage: 1,
      pageSize: 8,
      searchTerm: 'Jacket'
    },
    fetchPolicy: 'network-only'
  });
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error loading products: {error.message}
      </Typography>
    );
  }

  const featuredProducts = data.products.items.slice(0, 8);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Trending Products
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate('/products')}
          sx={{ textTransform: 'none' }}
        >
          View All Products
        </Button>
      </Box>
      <Grid container spacing={3}>
        {featuredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TrendingProducts; 