import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  Stack,
  Paper,
  Skeleton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import {
  selectCartItems,
  selectIsMiniCartOpen,
  selectCartLoading,
  selectCartError,
  selectCartId,
  closeMiniCart,
  setCartItems,
  setLoading,
  setError
} from '../../store/cartSlice';
import { GET_CART } from '../../graphql/cartOperations/getCart';

const CartItemSkeleton = () => (
  <ListItem sx={{ py: 2, gap: 2 }}>
    <Box sx={{ minWidth: 'auto' }}>
      <Skeleton 
        variant="rectangular" 
        width={80} 
        height={80} 
        sx={{ borderRadius: 1 }}
      />
    </Box>
    <Box sx={{ flex: 1, pr: 4 }}>
      <Skeleton variant="text" width="85%" height={28} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
    </Box>
  </ListItem>
);

const MiniCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsMiniCartOpen);
  const cartItems = useSelector(selectCartItems);
  const isLoading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const cartId = useSelector(selectCartId);

  const { data: cartData, loading: queryLoading, error: queryError, refetch } = useQuery(GET_CART, {
    variables: { cartId },
    skip: !cartId,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (isOpen && cartId) {
      refetch();
    }
  }, [isOpen, cartId, refetch]);

  useEffect(() => {
    if (queryLoading) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [queryLoading, dispatch]);

  useEffect(() => {
    if (queryError) {
      dispatch(setError(queryError.message));
    }
  }, [queryError, dispatch]);

  useEffect(() => {
    if (cartData?.cart) {
      dispatch(setCartItems({
        items: cartData.cart.items || [],
        total_quantity: cartData.cart.total_quantity || 0
      }));
    }
  }, [cartData, dispatch]);

  const handleClose = () => {
    dispatch(closeMiniCart());
  };

  const handleViewCart = () => {
    handleClose();
    navigate('/shopping-cart');
  };

  const handleCheckout = () => {
    handleClose();
    console.log('Navigate to checkout page');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item?.prices?.price?.value || 
                   item?.product?.price?.regularPrice?.amount?.value || 0;
      return total + (price * (item?.quantity || 0));
    }, 0).toFixed(2);
  };

  const renderItemContent = (item) => {
    return (
      <>
        <ListItemAvatar sx={{ minWidth: 'auto' }}>
          <Avatar
            alt={item?.product?.name || 'Product'}
            src={item?.product?.thumbnail?.url || item?.product?.image?.url}
            variant="square"
            sx={{ width: 80, height: 80 }}
          />
        </ListItemAvatar>
        <Box sx={{ flex: 1, pr: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            {item?.product?.name || 'Product'}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.primary"
            gutterBottom
          >
            ${item?.prices?.price?.value || 
               item?.product?.price?.regularPrice?.amount?.value || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Qty: {item.quantity}
          </Typography>
          {item?.product?.configurable_options?.map((option, index) => (
            <Typography
              key={index}
              variant="caption"
              color="text.primary"
              display="block"
            >
              {option.attribute_code}: {
                option.values.find(v => v.value_index === parseInt(item.selected_options?.[index]))?.label || ''
              }
            </Typography>
          ))}
          {item?.product?.only_x_left_in_stock && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, display: 'block' }}
            >
              Only {item.product.only_x_left_in_stock} left!
            </Typography>
          )}
        </Box>
      </>
    );
  };

  const renderContent = () => {
    if (isLoading || queryLoading) {
      return (
        <>
          {[1, 2, 3].map((index) => (
            <CartItemSkeleton key={index} />
          ))}
        </>
      );
    }

    if (error || queryError) {
      return (
        <Typography color="error" align="center" sx={{ py: 4 }}>
          Error loading cart: {error || queryError.message}
        </Typography>
      );
    }

    if (!cartItems?.length) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 8
        }}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.primary">
            Add items to your cart to start shopping
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ width: '100%', p: 0 }}>
        {cartItems.map((item) => (
          <ListItem 
            key={item.uid}
            sx={{ 
              py: 2,
              px: 0,
              borderBottom: '1px solid',
              borderColor: 'divider',
              alignItems: 'flex-start'
            }}
          >
            {renderItemContent(item)}
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: { 
          width: { xs: '100%', sm: 400 },
          display: 'flex',
          flexDirection: 'column'
        },
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          {isLoading || queryLoading ? (
            <Skeleton width={200} height={32} />
          ) : (
            `Shopping Cart (${cartData?.cart?.total_quantity || 0} items)`
          )}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* Scrollable Content */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto'
      }}>
        {renderContent()}
      </Box>

      {/* Fixed Bottom Section */}
      <Box sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">Subtotal</Typography>
            {isLoading ? (
              <Skeleton width={60} />
            ) : (
              <Typography variant="subtitle1">
                ${cartData?.cart?.prices?.subtotal_excluding_tax?.value || calculateTotal()}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleViewCart}
              disabled={isLoading || !cartItems?.length}
            >
              View Cart
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              disabled={isLoading || !cartItems?.length}
            >
              Checkout
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default MiniCart;