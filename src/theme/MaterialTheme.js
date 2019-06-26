import { createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#5c6b7d',
      main: '#34465d',
      dark: '#243141',
      contrastText: '#fff',
    },
    secondary: pink,
  },
  typography: {
    fontSize: 16,
    useNextVariants: true,
  },
  overrides: {
    Pagination: {
      activeButton: {
        fontSize: 28,
      },
    },
  },
});

export default theme;
