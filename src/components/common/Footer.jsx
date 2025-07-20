import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              About Fashion Store
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your one-stop destination for trendy fashion and accessories. 
              We bring you the latest styles at the best prices.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link
                component="button"
                color="inherit"
                onClick={() => navigate('/')}
                underline="hover"
              >
                Home
              </Link>
              <Link
                component="button"
                color="inherit"
                onClick={() => navigate('/products')}
                underline="hover"
              >
                Products
              </Link>
              <Link
                component="button"
                color="inherit"
                underline="hover"
              >
                Categories
              </Link>
              <Link
                component="button"
                color="inherit"
                underline="hover"
              >
                New Arrivals
              </Link>
            </Stack>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Customer Service
            </Typography>
            <Stack spacing={1}>
              <Link color="inherit" underline="hover">Contact Us</Link>
              <Link color="inherit" underline="hover">Shipping Policy</Link>
              <Link color="inherit" underline="hover">Returns & Exchanges</Link>
              <Link color="inherit" underline="hover">FAQs</Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Info
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">
                  123 Fashion Street, Design District
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2">
                  support@fashionstore.com
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Fashion Store. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link color="inherit" underline="hover">Privacy Policy</Link>
            <Link color="inherit" underline="hover">Terms of Service</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 