import { createTheme } from '@mui/material/styles';

const shape = { borderRadius: 12 };

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(162, 63%, 41%)',
      light: 'hsl(162, 63%, 55%)',
      dark: 'hsl(162, 63%, 32%)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'hsl(40, 30%, 88%)',
      contrastText: 'hsl(220, 20%, 20%)',
    },
    error: {
      main: 'hsl(0, 72%, 58%)',
    },
    success: {
      main: 'hsl(152, 60%, 42%)',
    },
    warning: {
      main: 'hsl(38, 92%, 58%)',
    },
    background: {
      default: 'hsl(40, 33%, 97%)',
      paper: '#ffffff',
    },
    text: {
      primary: 'hsl(220, 20%, 14%)',
      secondary: 'hsl(220, 10%, 50%)',
    },
    divider: 'hsl(220, 13%, 90%)',
  },
  shape,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'hsl(162, 63%, 45%)',
      light: 'hsl(162, 63%, 60%)',
      dark: 'hsl(162, 63%, 35%)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'hsl(224, 16%, 16%)',
      contrastText: 'hsl(210, 20%, 85%)',
    },
    error: {
      main: 'hsl(0, 72%, 52%)',
    },
    success: {
      main: 'hsl(152, 60%, 45%)',
    },
    warning: {
      main: 'hsl(38, 92%, 55%)',
    },
    background: {
      default: 'hsl(224, 20%, 8%)',
      paper: 'hsl(224, 18%, 12%)',
    },
    text: {
      primary: 'hsl(210, 20%, 92%)',
      secondary: 'hsl(220, 10%, 55%)',
    },
    divider: 'hsl(224, 14%, 20%)',
  },
  shape,
});
