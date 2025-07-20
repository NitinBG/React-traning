import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { selectCartId } from '../../store/cartSlice';
import { GET_PRODUCT_OPTIONS } from '../../graphql/productOperations';
import { ADD_TO_CART } from '../../graphql/cartOperations/addtoCart';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartId = useSelector(selectCartId);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [loading, setLoading] = useState(false);

  // Query for product options if it's a configurable product
  const { data: optionsData, loading: optionsLoading } = useQuery(GET_PRODUCT_OPTIONS, {
    variables: { sku: product.sku },
    skip: !product.sku,
  });

  const isConfigurable = optionsData?.products?.items[0]?.__typename === 'ConfigurableProduct';
  const configurableOptions = optionsData?.products?.items[0]?.configurable_options || [];
  const variants = optionsData?.products?.items[0]?.variants || [];

  // Auto-select first available variant when options data loads
  useEffect(() => {
    if (isConfigurable && configurableOptions.length > 0 && variants.length > 0) {
      // Find first variant that's in stock
      const firstAvailableVariant = variants.find(variant => 
        variant.product.stock_status === 'IN_STOCK'
      );

      if (firstAvailableVariant) {
        const initialOptions = {};
        firstAvailableVariant.attributes.forEach(attr => {
          initialOptions[attr.code] = attr.value_index;
        });
        setSelectedOptions(initialOptions);
      }
    }
  }, [isConfigurable, configurableOptions, variants]);

  const [addToCart] = useMutation(ADD_TO_CART, {
    onCompleted: (data) => {
      setLoading(false);
      if (data.addProductsToCart.cart.items.length === 0) {
        console.log('Cart is empty after adding product. Checking for errors...');
        if (data.addProductsToCart.user_errors?.length > 0) {
          console.log('Cart errors:', data.addProductsToCart.user_errors);
          // Handle errors - show to user
        }
      }
    },
    onError: (error) => {
      console.error('Add to cart error:', error);
      setLoading(false);
    }
  });

  const findMatchingVariant = () => {
    return variants.find(variant => 
      variant.attributes.every(attr => 
        selectedOptions[attr.code] === attr.value_index
      )
    );
  };

  const handleAddToCart = async () => {
    if (!cartId) {
      console.error('No cart ID available');
      return;
    }

    setLoading(true);

    let cartItem = {
      quantity: 1
    };

    if (isConfigurable) {
      const variant = findMatchingVariant();
      if (!variant) {
        console.error('No variant available');
        setLoading(false);
        return;
      }
      cartItem = {
        ...cartItem,
        sku: variant.product.sku,
        selected_options: Object.entries(selectedOptions).map(([code, value_index]) => (
          btoa(`${code}/${value_index}`)
        ))
      };
    } else {
      cartItem.sku = product.sku;
    }

    try {
      await addToCart({
        variables: {
          cartId,
          cartItems: [cartItem]
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setLoading(false);
    }
  };

  // Get selected option labels for display
  const getSelectedOptionLabels = () => {
    if (!isConfigurable) return null;

    return configurableOptions.map(option => {
      const selectedValueIndex = selectedOptions[option.attribute_code];
      const selectedValue = option.values.find(v => v.value_index === selectedValueIndex);
      return {
        label: option.label,
        value: selectedValue?.label || ''
      };
    });
  };

  const selectedOptionLabels = getSelectedOptionLabels();
  const variant = isConfigurable ? findMatchingVariant() : null;
  const isOutOfStock = variant ? variant.product.stock_status !== 'IN_STOCK' : false;

  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={product.image?.url || 'placeholder.jpg'}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.primary">
          ${product.price?.regularPrice?.amount?.value || 'N/A'}
        </Typography>

        {isConfigurable && selectedOptionLabels && (
          <Box sx={{ mt: 1 }}>
            {selectedOptionLabels.map((option, index) => (
              <Typography
                key={index}
                variant="caption"
                color="text.primary"
                display="block"
              >
                {option.label}: {option.value}
              </Typography>
            ))}
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddToCart}
            disabled={loading || optionsLoading || isOutOfStock}
          >
            {loading ? <CircularProgress size={24} /> : 
             isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 