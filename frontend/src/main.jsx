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
