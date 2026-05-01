import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@/features/theme/model/theme-store';
import { lightTheme, darkTheme } from '@/shared/theme/mui-theme';

export const MuiProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      {children}
    </ThemeProvider>
  );
};
