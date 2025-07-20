import { gql } from "@apollo/client";

export const CART_ITEM_DETAILS = gql`
  fragment CartItemDetails on CartItemInterface {
    errors {
      code
      message
    }
    product {
      id
      name
      sku
      url_key
      image {
        url
        label
      }
      thumbnail {
        url
        label
      }
      description {
        html
      }
      price {
        regularPrice {
          amount {
            value
            currency
          }
        }
      }
      stock_status
      only_x_left_in_stock
    }
  }
`;