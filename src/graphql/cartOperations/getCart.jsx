import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) {
      id
      email
      is_virtual
      total_quantity
      applied_coupons {
        code
      }
      available_payment_methods {
        code
        title
      }
      billing_address {
        firstname
        lastname
        street
        city
        postcode
        telephone
        uid
      }
      items {
        id
        quantity
        uid
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
          ... on ConfigurableProduct {
            configurable_options {
              attribute_code
              values {
                value_index
                label
              }
            }
            variants {
              attributes {
                code
                value_index
              }
              product {
                sku
                stock_status
              }
            }
          }
        }
        prices {
          price {
            value
            currency
          }
          row_total {
            value
            currency
          }
        }
      }
      selected_payment_method {
        code
        title
      }
      shipping_addresses {
        firstname
        lastname
        street
        city
        postcode
        telephone
        uid
      }
      prices {
        grand_total {
          value
          currency
        }
        subtotal_excluding_tax {
          value
          currency
        }
      }
    }
  }
`;
