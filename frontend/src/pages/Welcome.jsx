/**
 * @description A React component that renders the animated welcome/landing page with hero content and recent public snippets.
 * 
 * @usage This component is used on the root route (/) to introduce AiCodySnippets, provide entry points to register or log in, and showcase up to eight recent public snippets.
 * 
 * @param {Object} props - The component props
 * @returns {JSX.Element} The rendered component
 * 
 * @example
 * <Welcome />
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Typography, Box, Button, Grid, Card, CardContent, Chip, Fade, Grow, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip } from '@mui/material';
import { Code as CodeIcon, TrendingUp, Share, Lock, ContentCopy as ContentCopyIcon, Close as CloseIcon, NavigateBefore as NavigateBeforeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { CodeBlock, CursorGlow } from '../components';
import axios from 'axios';

function Welcome() {
  const { user } = useSelector((state) => state.auth);
  const [recentSnippets, setRecentSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSnippet, setViewSnippet] = useState(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleOpenView = (snippet, index) => {
    setViewSnippet(snippet);
    setViewIndex(index);
    setViewOpen(true);
    setCopied(false);
  };

  const handleCloseView = () => {
    setViewOpen(false);
    setViewSnippet(null);
  };

  const handleNextSnippet = () => {
    const next = viewIndex + 1;
    if (next < recentSnippets.length) {
      setViewIndex(next);
      setViewSnippet(recentSnippets[next]);
      setCopied(false);
    }
  };

  const handlePrevSnippet = () => {
    const prev = viewIndex - 1;
    if (prev >= 0) {
      setViewIndex(prev);
      setViewSnippet(recentSnippets[prev]);
      setCopied(false);
    }
  };

  const handleCopyCode = async () => {
    if (!viewSnippet) return;
    try {
      await navigator.clipboard.writeText(viewSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchRecentSnippets = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const response = await axios.get(`${API_URL}/snippets/public?sort=-createdAt`);
        const snippets = response.data?.data || response.data || [];
        setRecentSnippets(snippets.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch recent snippets:', error);
        setRecentSnippets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSnippets();
  }, []);

  return (
    <>
      <CursorGlow />
      <Box 
        sx={{ 
          minHeight: '100vh', 
          pb: 8,
          position: 'relative',
          overflow: 'hidden',
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(233, 165, 48, 0.15) 0%, 
              transparent 50%),
            linear-gradient(135deg, 
              #1a1a1a 0%, 
              #212121 25%,
              #2a2a2a 50%,
              #212121 75%,
              #1a1a1a 100%)
          `,
          transition: 'background 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(233, 165, 48, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(233, 165, 48, 0.08) 0%, transparent 50%)
            `,
            animation: 'gradientShift 15s ease infinite',
            '@keyframes gradientShift': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
              '66%': { transform: 'translate(-30px, 30px) scale(0.9)' },
            },
          },
        }}
      >
        <Container maxWidth="xl" sx={{ pt: 4, position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                textAlign: 'center',
                gap: 3,
                transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              <Grow in timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    transform: `translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px)`,
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  <CodeIcon 
                    sx={{ 
                      fontSize: 120, 
                      color: 'primary.main',
                      filter: 'drop-shadow(0 0 30px rgba(233, 165, 48, 0.6))',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': {
                          transform: 'translateY(0px) rotate(0deg)',
                        },
                        '50%': {
                          transform: 'translateY(-20px) rotate(5deg)',
                        },
                      },
                    }} 
                  />
                </Box>
              </Grow>
              
              <Fade in timeout={1200}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    background: 'linear-gradient(135deg, #E9A530 0%, #FFC870 50%, #E9A530 100%)',
                    backgroundSize: '200% auto',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 3s linear infinite',
                    textShadow: '0 0 40px rgba(233, 165, 48, 0.3)',
                    '@keyframes shimmer': {
                      '0%': { backgroundPosition: '0% center' },
                      '100%': { backgroundPosition: '200% center' },
                    },
                  }}
                >
                  {'{AiCodySnippets}'}
                </Typography>
              </Fade>
              
              <Fade in timeout={1300}>
                <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Chip 
                    icon={<TrendingUp />} 
                    label="Fast & Efficient" 
                    sx={{ 
                      px: 1,
                      background: 'rgba(233, 165, 48, 0.1)',
                      border: '1px solid rgba(233, 165, 48, 0.3)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: 'rgba(233, 165, 48, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                    }} 
                  />
                  <Chip 
                    icon={<Share />} 
                    label="Share Easily" 
                    sx={{ 
                      px: 1,
                      background: 'rgba(233, 165, 48, 0.1)',
                      border: '1px solid rgba(233, 165, 48, 0.3)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: 'rgba(233, 165, 48, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                    }} 
                  />
                  <Chip 
                    icon={<Lock />} 
                    label="Secure" 
                    sx={{ 
                      px: 1,
                      background: 'rgba(233, 165, 48, 0.1)',
                      border: '1px solid rgba(233, 165, 48, 0.3)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: 'rgba(233, 165, 48, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                    }} 
                  />
                </Box>
              </Fade>
              
              <Fade in timeout={1400}>
                <Typography variant="h5" color="text.secondary" paragraph>
                  A modern code snippets management application
                </Typography>
              </Fade>
              
              <Fade in timeout={1600}>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                  Organize, store, and manage your code snippets with ease. Create private snippets
                  or share them with the community.
                </Typography>
              </Fade>
              
              <Fade in timeout={1800}>
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {user ? (
                    <Button
                      component={Link}
                      to="/dashboard"
                      variant="contained"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 20px rgba(233, 165, 48, 0.4)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 30px rgba(233, 165, 48, 0.6)',
                        },
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        size="large"
                        sx={{
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          boxShadow: '0 4px 20px rgba(233, 165, 48, 0.4)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 30px rgba(233, 165, 48, 0.6)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transition: 'left 0.5s',
                          },
                          '&:hover::before': {
                            left: '100%',
                          },
                        }}
                      >
                        Get Started
                      </Button>
                      <Button
                        component={Link}
                        to="/login"
                        variant="outlined"
                        size="large"
                        sx={{
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderWidth: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-3px)',
                            backgroundColor: 'rgba(233, 165, 48, 0.1)',
                            boxShadow: '0 4px 20px rgba(233, 165, 48, 0.3)',
                          },
                        }}
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </Box>
              </Fade>
            </Box>
          </Fade>

          {/* Recent Snippets Section */}
          {!loading && recentSnippets.length > 0 && (
            <Fade in timeout={2000}>
              <Box sx={{ mt: 16, mb: 6 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                  <Typography 
                    variant="h3" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #E9A530 0%, #FFC870 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2,
                    }}
                  >
                    Recent Code Snippets
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Explore the latest snippets shared by our community
                  </Typography>
                </Box>
                <Grid container spacing={4}>
                  {recentSnippets.map((snippet, index) => (
                    <Grow 
                      key={snippet._id} 
                      in 
                      timeout={2000 + (index * 150)}
                      style={{ transformOrigin: '0 0 0' }}
                    >
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: 'flex' }}>
                        <Card 
                          onClick={() => handleOpenView(snippet, index)}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            minWidth: 0,
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, rgba(42, 42, 42, 0.8) 0%, rgba(33, 33, 33, 0.9) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(233, 165, 48, 0.1)',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '3px',
                              background: 'linear-gradient(90deg, #E9A530, #FFC870)',
                              transform: 'scaleX(0)',
                              transition: 'transform 0.3s ease',
                            },
                            '&:hover': {
                              transform: 'translateY(-8px) scale(1.02)',
                              boxShadow: '0 12px 40px rgba(233, 165, 48, 0.3)',
                              border: '1px solid rgba(233, 165, 48, 0.3)',
                            },
                            '&:hover::before': {
                              transform: 'scaleX(1)',
                            },
                          }}
                        >
                          <CardContent sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                            <Typography 
                              variant="h6" 
                              component="div" 
                              noWrap
                              sx={{ mb: 1 }}
                            >
                              {snippet.title}
                            </Typography>
                            <Chip
                              label={snippet.language}
                              size="small"
                              sx={{ mb: 1, backgroundColor: '#FFB300', color: '#1a1a1a', fontWeight: 600 }}
                            />
                            {snippet.description && (
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                noWrap
                                sx={{ mb: 1 }}
                              >
                                {snippet.description}
                              </Typography>
                            )}
                            <CodeBlock 
                              code={snippet.code} 
                              language={snippet.language} 
                              maxHeight={96}
                              overflow="hidden"
                            />
                            {snippet.tags && snippet.tags.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                {snippet.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Chip
                                    key={tagIndex}
                                    label={tag}
                                    size="small"
                                    sx={{ mr: 0.5, mt: 0.5, backgroundColor: 'rgba(255,179,0,0.12)', color: '#FFB300', border: '1px solid rgba(255,179,0,0.35)' }}
                                  />
                                ))}
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grow>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}
          {/* Snippet View Dialog */}
          <Dialog open={viewOpen} onClose={handleCloseView} maxWidth="md" fullWidth keepMounted={false}>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                    {viewSnippet?.title}
                  </Typography>
                  {viewSnippet?.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                      {viewSnippet.description}
                    </Typography>
                  )}
                </Box>
                <IconButton size="small" onClick={handleCloseView} sx={{ mt: 0.25, flexShrink: 0 }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label={viewSnippet?.language}
                  size="small"
                  sx={{ backgroundColor: '#FFB300', color: '#1a1a1a', fontWeight: 600 }}
                />
                {viewSnippet?.tags?.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag}
                    size="small"
                    sx={{ backgroundColor: 'rgba(255,179,0,0.12)', color: '#FFB300', border: '1px solid rgba(255,179,0,0.35)' }}
                  />
                ))}
              </Box>
              <CodeBlock code={viewSnippet?.code || ''} language={viewSnippet?.language} maxHeight={480} />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title="Previous snippet">
                  <span>
                    <IconButton size="small" onClick={handlePrevSnippet} disabled={viewIndex === 0}>
                      <NavigateBeforeIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 48, textAlign: 'center' }}>
                  {viewIndex + 1} / {recentSnippets.length}
                </Typography>
                <Tooltip title="Next snippet">
                  <span>
                    <IconButton size="small" onClick={handleNextSnippet} disabled={viewIndex === recentSnippets.length - 1}>
                      <NavigateNextIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<ContentCopyIcon />}
                  size="small"
                  onClick={handleCopyCode}
                  variant="outlined"
                  color={copied ? 'success' : 'primary'}
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
                <Button onClick={handleCloseView} variant="contained">
                  Close
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
}

export default Welcome;
