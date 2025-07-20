import { gql } from "@apollo/client";
import {CART_ITEM_DETAILS} from "./cartItemDetails";

export const ADD_TO_CART = gql`
  mutation AddProductsToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(
      cartId: $cartId
      cartItems: $cartItems
    ) {
      cart {
        id
        total_quantity
        items {
          id
          quantity
          uid
          product {
            name
            sku
            ... on ConfigurableProduct {
              configurable_options {
                attribute_code
                values {
                  value_index
                  label
                }
              }
            }
            ...CartItemDetails
          }
        }
      }
      user_errors {
        code
        message
      }
    }
  }
  ${CART_ITEM_DETAILS}
`;