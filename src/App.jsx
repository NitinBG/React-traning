import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import client from './apollo/apollo-client';
import Navbar from './components/common/Navbar';
import HomePage from './components/home/HomePage';
import ProductListingPage from './components/productList/ProductListingPage';
import CartInitializer from './components/cart/CartInitializer';
import MiniCart from './components/cart/MiniCart';
import Footer from './components/common/Footer';
import ShoppingCart from './components/cart/ShoppingCart';



const theme = createTheme({
  palette: {
    primary: {
      main: '#1a063a',
    },
    primary: {
      main: '#1a063a',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="App">
            <CartInitializer />
            <Navbar />
            <MiniCart />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/shopping-cart" element={<ShoppingCart />} />
            </Routes>
            <Footer />
          </div>
        </ThemeProvider>
      </ApolloProvider>
    </Router>
  );
}

export default App;