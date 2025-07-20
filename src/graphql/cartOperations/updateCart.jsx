import { gql } from "@apollo/client";
import {CART_ITEM_DETAILS} from "./cartItemDetails";

export const UPDATE_CART_ITEMS = gql`
  mutation UpdateCartItems($input: UpdateCartItemsInput!) {
    updateCartItems(input: $input) {
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
    }
  }
  ${CART_ITEM_DETAILS}
`;
