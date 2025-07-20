import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { CREATE_EMPTY_CART } from '../../graphql/cartOperations/createEmptyCart';
import { selectCartId, setCartId } from '../../store/cartSlice';

const CartInitializer = () => {
  const dispatch = useDispatch();
  const cartId = useSelector(selectCartId);
  
  const [createEmptyCart] = useMutation(CREATE_EMPTY_CART, {
    onCompleted: (data) => {
      if (data?.createEmptyCart) {
        dispatch(setCartId(data.createEmptyCart));
      }
    },
    onError: (error) => {
      console.error('Error creating cart:', error);
    }
  });

  useEffect(() => {
    if (!cartId) {
      createEmptyCart();
    }
  }, [cartId, createEmptyCart]);

  return null;
};

export default CartInitializer; 