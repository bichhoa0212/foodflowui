import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import {
  LocalGroceryStore,
  Brush,
  Nature,
  LocalShipping,
  Savings
} from '@mui/icons-material';
import styles from './FeaturesSection.module.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: <LocalGroceryStore className={styles.featureIcon} style={{ color: '#666' }} />,
      title: "Curated Products",
      description: "from Handpicked Sellers",
      color: "#e8f5e8"
    },
    {
      icon: <Brush className={styles.featureIcon} style={{ color: '#666' }} />,
      title: "Handmade",
      description: "Made with passion by 300+ curators across the country",
      color: "#fff8e1"
    },
    {
      icon: <Nature className={styles.featureIcon} style={{ color: '#666' }} />,
      title: "100% Natural",
      description: "Eat local, consume local, closer to nature.",
      color: "#f5f5dc"
    },
    {
      icon: <LocalShipping className={styles.featureIcon} style={{ color: '#666' }} />,
      title: "Shipping",
      description: "Delivery in 2 hours",
      color: "#e3f2fd"
    },
    {
      icon: <Savings className={styles.featureIcon} style={{ color: '#666' }} />,
      title: "Save Money",
      description: "Membership discount every month",
      color: "#f3e5f5"
    }
  ];

  return (
    <Box className={styles.featuresSection}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Box 
                className={styles.featureBlock}
                style={{ backgroundColor: feature.color }}
              >
                <Box className={styles.iconContainer}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" className={styles.featureTitle}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" className={styles.featureDescription}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection; 