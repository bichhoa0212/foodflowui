import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#176443' }, // Xanh lá đậm
    secondary: { main: '#1976d2' }, // Xanh dương
    background: {
      default: '#f7f9fb', // Nền trang xám rất nhạt
      paper: '#fff',
    },
    warning: { main: '#b2a12c' }, // Vàng olive
    success: { main: '#43a047' },
    info: { main: '#00bcd4' },
    error: { main: '#e53935' },
    text: {
      primary: '#222',
      secondary: '#666',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeightBold: 700,
    fontWeightMedium: 600,
    fontWeightRegular: 400,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme; 