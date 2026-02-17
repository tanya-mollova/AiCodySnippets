/**
 * @description A React entrypoint module that bootstraps the React app with Redux and MUI theming.
 * 
 * @usage This file is used by Vite to mount the React application into the DOM, wrapping App with the Redux Provider and MUI ThemeProvider.
 * 
 * @param {Object} props - The component props
 * @returns {JSX.Element} The rendered component tree
 * 
 * @example
 * // main.jsx is executed automatically by Vite and does not export a component.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E9A530',
    },
    background: {
      default: '#212121',
      paper: '#2a2a2a',
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
