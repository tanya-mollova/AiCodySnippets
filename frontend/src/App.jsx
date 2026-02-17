import { Container, Typography, Box, Button } from '@mui/material'
import { Code as CodeIcon } from '@mui/icons-material'
import './App.css'

function App() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <CodeIcon sx={{ fontSize: 80, color: 'primary.main' }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to AiCodySnippets
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          A modern code snippets management application
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
          Your initial setup is complete! The backend is running on port 5000 and the frontend is
          ready with Redux and Material-UI configured. You can now start developing features like
          adding, editing, and managing code snippets.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" size="large">
            Get Started
          </Button>
          <Button variant="outlined" size="large">
            View Snippets
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default App
