import React from 'react';
import ReactDOM from 'react-dom/client';
import './config/axiosConfig'; // Import axios configuration
import App from './App';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
