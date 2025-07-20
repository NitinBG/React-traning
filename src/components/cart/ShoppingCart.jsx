import React from "react";
import { useSelector } from "react-redux";
import { selectCartId } from "../../store/cartSlice";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { UPDATE_CART_ITEMS } from "../../graphql/cartOperations/updateCart";

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

function ShoppingCart() {
  const cartId = useSelector(selectCartId);

  const { loading, error, data, refetch } = useQuery(GET_CART, {
    variables: { cartId },
    skip: !cartId,
    fetchPolicy: "network-only",
  });

  const [updateCartItems] = useMutation(UPDATE_CART_ITEMS, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error updating cart items:", error);
    },
  });

  const handleUpdateQuantity = async (uid, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1 || newQuantity === currentQuantity) return;
    updateCartItems({
      variables: {
        input: {
          cart_id: cartId,
          cart_items: [
            {
              cart_item_uid: uid,
              quantity: newQuantity,
            },
          ],
        },
      },
    });
  };

  const handleDeleteItem = async (uid) => {
    updateCartItems({
      variables: {
        input: {
          cart_id: cartId,
          cart_items: [
            {
              cart_item_uid: uid,
              quantity: 0,
            },
          ],
        },
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.cart?.items?.map((item) => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <img
                            src={
                              item.product.image?.url ||
                              item.product.thumbnail?.url
                            }
                            alt="Smart Watch Pro"
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle1">
                              {item.product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.product.sku}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.uid,
                                  item.quantity,
                                  -1
                                )
                              }
                              disabled={item.quantity <= 1}
                              size="small"
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="body1" sx={{ mx: 1 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                handleUpdateQuantity(item.uid, item.quantity, 1)
                              }
                              size="small"
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableCell>
                      <TableCell align="right">
                        ${item.prices.price.value.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography variant="body1">
                            ${item.prices.row_total.value.toFixed(2)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteItem(item.uid)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Subtotal:</Typography>
                <Typography>
                  ${data?.cart?.prices?.subtotal_excluding_tax?.value}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="subtitle1">Grand Total:</Typography>
                <Typography variant="subtitle1">
                  ${data?.cart?.prices.grand_total?.value}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              href="/checkout"
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ShoppingCart;
