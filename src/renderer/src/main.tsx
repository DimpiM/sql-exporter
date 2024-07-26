import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './localization/i18n';

const theme = createTheme({
  components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '24px',
          }
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: '24px',
          }
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '24px'
          }
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '24px'
          }
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            borderRadius: '24px'
          }
        },
      },
      MuiDivider: {
        styleOverrides: {
          inset: {
            marginLeft: '24px'
          }
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: '32px'
          }
        },
      },
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
