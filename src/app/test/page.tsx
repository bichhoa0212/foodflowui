'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TestAPI from '@/components/TestAPI';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const TestPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TestAPI />
    </ThemeProvider>
  );
};

export default TestPage; 