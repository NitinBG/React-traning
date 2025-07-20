import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  Grid,
  Container,
  Typography,
  Box,
  CircularProgress,
  Breadcrumbs,
  Link,
  Pagination,
  Paper,
  InputBase,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../common/ProductCard';
import { GET_PRODUCTS } from '../../graphql/productOperations';


const ITEMS_PER_PAGE = 8;

const ProductListingPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('Jacket');

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm || 'Jacket');
      setPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: {
      currentPage: page,
      pageSize: ITEMS_PER_PAGE,
      searchTerm: debouncedSearch
    },
    fetchPolicy: 'network-only'
  });

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setDebouncedSearch(searchTerm || 'Jacket');
    setPage(1);
  };

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error" align="center">
          Error loading products: {error.message}
        </Typography>
      </Container>
    );
  }

  const totalPages = data?.products?.total_count 
    ? Math.ceil(data.products.total_count / ITEMS_PER_PAGE) 
    : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">All Products</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Products
        </Typography>
        <Typography variant="body1" color="text.primary">
          {data?.products?.total_count
            ? `Showing ${data.products.total_count} products`
            : 'Discover our collection of trendy jackets and fashion wear'}
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', sm: 400 },
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search products..."
            inputProps={{ 'aria-label': 'search products' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Products Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : data?.products?.items?.length > 0 ? (
        <Grid container spacing={3}>
          {data.products.items.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center" sx={{ py: 4 }}>
          No products found
        </Typography>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductListingPage; 




























































// import React, { useState } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Paper,
//   Grid,
//   Button,
//   IconButton,
//   Divider,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Stack,
//   Skeleton,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useDispatch, useSelector } from 'react-redux';
// import { useQuery, useMutation } from '@apollo/client';

// import {
//   selectCartId,
//   } from '../../store/cartSlice';
// import { GET_CART } from '../../graphql/cartOperations/getCart';
// import { UPDATE_CART_ITEMS } from '../../graphql/cartOperations/updateCart'; 

// const CartItemSkeleton = () => (
//   <TableRow>
//     <TableCell colSpan={4}>
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//         <Box sx={{ width: 80, height: 80 }}>
//           <Skeleton variant="rectangular" width={80} height={80} />
//         </Box>
//         <Box sx={{ flex: 1 }}>
//           <Skeleton variant="text" width="60%" />
//           <Skeleton variant="text" width="40%" />
//         </Box>
//       </Box>
//     </TableCell>
//   </TableRow>
// );

// const Cart = () => {
//   const cartId = useSelector(selectCartId);
//   const [updatingItems, setUpdatingItems] = useState({});


//   const { data: cartData, loading: queryLoading, error: queryError, refetch } = useQuery(GET_CART, {
//     variables: { cartId },
//     skip: !cartId,
//     fetchPolicy: 'network-only'
//   });

//   const cart = cartData?.cart || {};

//   const [updateCartItems] = useMutation(UPDATE_CART_ITEMS, {
//     onCompleted: (data) => {
//       if (data?.updateCartItems?.cart) {
//          refetch();
//       }
//     },
//     onError: (error) => {
//       console.error('Error updating cart:', error);
//     }
//   });

//   const handleUpdateQuantity = async (itemId, currentQuantity, delta) => {
//     const newQuantity = Math.max(0, currentQuantity + delta);
//     if (newQuantity === currentQuantity) return;
    
//     setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

//     try {
//       await updateCartItems({
//         variables: {
//           input: {
//             cart_id: cartId,
//             cart_items: [{
//               cart_item_uid: itemId,
//               quantity: newQuantity
//             }]
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
//     }
//   };

//   const handleDeleteItem = async (itemId) => {
//     setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

//     try {
//       await updateCartItems({
//         variables: {
//           input: {
//             cart_id: cartId,
//             cart_items: [{
//               cart_item_uid: itemId,
//               quantity: 0
//             }]
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
//     }
//   };

//   if (queryError) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Typography color="error" align="center">
//           Error loading cart: { queryError.message}
//         </Typography>
//       </Container>
//     );
//   }

//   if (!cart.items?.length && !queryLoading) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Paper sx={{ p: 4, textAlign: 'center' }}>
//           <Typography variant="h5" gutterBottom>
//             Your cart is empty
//           </Typography>
//           <Typography variant="body1" color="text.primary" paragraph>
//             Add items to your cart to start shopping
//           </Typography>
//           <Button variant="contained" color="primary" href="/">
//             Continue Shopping
//           </Button>
//         </Paper>
//       </Container>
//     );
//   }

//   return (
    // <Container maxWidth="lg" sx={{ py: 4 }}>
    //   <Typography variant="h4" component="h1" gutterBottom>
    //     Shopping Cart
    //   </Typography>

    //   { queryLoading ? (
    //     <TableContainer component={Paper}>
    //       <Table>
    //         <TableBody>
    //           {[1, 2, 3].map((i) => (
    //             <CartItemSkeleton key={i} />
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>
    //   ) : (
    //     <Grid container spacing={4}>
    //       <Grid item xs={12} md={8}>
    //         <TableContainer component={Paper}>
    //           <Table>
    //             <TableHead>
    //               <TableRow>
    //                 <TableCell>Product</TableCell>
    //                 <TableCell align="center">Quantity</TableCell>
    //                 <TableCell align="right">Price</TableCell>
    //                 <TableCell align="right">Total</TableCell>
    //               </TableRow>
    //             </TableHead>
    //             <TableBody>
    //               {cart.items?.map((item) => {
    //                 const product = item.product;
    //                 const imageUrl = product.image?.url || '';
    //                 const isUpdating = updatingItems[item.uid];

    //                 return (
    //                   <TableRow key={item.uid}>
    //                     <TableCell>
    //                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    //                         <img
    //                           src={imageUrl}
    //                           alt={product.name}
    //                           style={{ width: 80, height: 80, objectFit: 'cover' }}
    //                         />
    //                         <Box>
    //                           <Typography variant="subtitle1">{product.name}</Typography>
    //                           <Typography variant="body2" color="text.secondary">
    //                             SKU: {product.sku}
    //                           </Typography>
    //                         </Box>
    //                       </Box>
    //                     </TableCell>
    //                     <TableCell align="center">
    //                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    //                         <IconButton
    //                           onClick={() => handleUpdateQuantity(item.uid, item.quantity, -1)}
    //                           disabled={isUpdating}
    //                           size="small"
    //                         >
    //                           <RemoveIcon fontSize="small" />
    //                         </IconButton>
    //                         <Typography variant="body1" sx={{ mx: 1 }}>
    //                           {item.quantity}
    //                         </Typography>
    //                         <IconButton
    //                           onClick={() => handleUpdateQuantity(item.uid, item.quantity, 1)}
    //                           disabled={isUpdating}
    //                           size="small"
    //                         >
    //                           <AddIcon fontSize="small" />
    //                         </IconButton>
    //                       </Box>
    //                     </TableCell>
    //                     <TableCell align="right">
    //                       ${item.prices.price.value.toFixed(2)}
    //                     </TableCell>
    //                     <TableCell align="right">
    //                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
    //                         ${item.prices.row_total.value.toFixed(2)}
    //                         <IconButton
    //                           onClick={() => handleDeleteItem(item.uid)}
    //                           sx={{ ml: 1 }}
    //                           size="small"
    //                         >
    //                           <DeleteIcon fontSize="small" />
    //                         </IconButton>
    //                       </Box>
    //                     </TableCell>
    //                   </TableRow>
    //                 );
    //               })}
    //             </TableBody>
    //           </Table>
    //         </TableContainer>
    //       </Grid>

    //       <Grid item xs={12} md={4}>
    //         <Paper sx={{ p: 3 }}>
    //           <Typography variant="h6" gutterBottom>
    //             Order Summary
    //           </Typography>

    //           <Box sx={{ mb: 2 }}>
    //             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    //               <Typography>Subtotal (excl. tax):</Typography>
    //               <Typography>${cart.prices.subtotal_excluding_tax.value.toFixed(2)}</Typography>
    //             </Box>
    //             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    //               <Typography>Tax:</Typography>
    //               <Typography>
    //                 ${(cart.prices.grand_total.value - cart.prices.subtotal_excluding_tax.value).toFixed(2)}
    //               </Typography>
    //             </Box>
    //             <Divider sx={{ my: 2 }} />
    //             <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
    //               <Typography variant="subtitle1">Grand Total:</Typography>
    //               <Typography variant="subtitle1">
    //                 ${cart.prices.grand_total.value.toFixed(2)}
    //               </Typography>
    //             </Box>
    //           </Box>

    //           <Box sx={{ mt: 3 }}>
    //             <Typography variant="subtitle2" gutterBottom>
    //               Available Payment Methods
    //             </Typography>
    //             <Stack spacing={1}>
    //               {cart.available_payment_methods?.map((method) => (
    //                 <Typography key={method.code} variant="body2">
    //                   {method.title} ({method.code})
    //                 </Typography>
    //               ))}
    //             </Stack>
    //           </Box>

         
    //           <Button
    //             fullWidth
    //             variant="contained"
    //             color="primary"
    //             size="large"
    //             sx={{ mt: 3 }}
    //             href="/checkout"
    //           >
    //             Proceed to Checkout
    //           </Button>
    //         </Paper>
    //       </Grid>
    //     </Grid>
    //   )}
    // </Container>
//   );
// };

// export default Cart;