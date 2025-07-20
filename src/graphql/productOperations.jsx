import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($currentPage: Int!, $pageSize: Int!, $searchTerm: String!) {
    products(
      search: $searchTerm
      pageSize: $pageSize
      currentPage: $currentPage
    ) {
      items {
        id
        name
        price {
          regularPrice {
            amount {
              value
              currency
            }
          }
        }
        image {
          url
          label
        }
        description {
          html
        }
        sku
        thumbnail {
          url
          label
        }
      }
      total_count
    }
  }
`;



export const GET_PRODUCT_OPTIONS = gql`
  query GetProductOptions($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        __typename
        sku
        ... on ConfigurableProduct {
          configurable_options {
            attribute_code
            attribute_id
            id
            label
            values {
              default_label
              label
              store_label
              use_default_value
              value_index
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
    }
  }
`;