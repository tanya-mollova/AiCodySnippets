import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Navbar, FiltersBar, CodeBlock } from '../components';
import { fetchPublicSnippets } from '../store/slices/snippetsSlice';

function PublicSnippets() {
  const dispatch = useDispatch();
  const { publicItems, loadingPublic, errorPublic } = useSelector((state) => state.snippets);

  const [publicFilters, setPublicFilters] = useState({ language: '', search: '', sort: '-createdAt' });

  // View popup state
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSnippet, setViewSnippet] = useState(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [viewList, setViewList] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(fetchPublicSnippets(publicFilters));
  }, [dispatch]);

  const applyFilters = (values) => {
    setPublicFilters(values);
    dispatch(fetchPublicSnippets(values));
  };

  const resetFilters = () => {
    const defaults = { language: '', search: '', sort: '-createdAt' };
    setPublicFilters(defaults);
    dispatch(fetchPublicSnippets(defaults));
  };

  // View popup handlers
  const handleOpenView = (snippet, list, index) => {
    setViewSnippet(snippet);
    setViewList(list);
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
    if (next < viewList.length) { setViewIndex(next); setViewSnippet(viewList[next]); setCopied(false); }
  };

  const handlePrevSnippet = () => {
    const prev = viewIndex - 1;
    if (prev >= 0) { setViewIndex(prev); setViewSnippet(viewList[prev]); setCopied(false); }
  };

  const handleCopyCode = async () => {
    if (!viewSnippet) return;
    try { await navigator.clipboard.writeText(viewSnippet.code); } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 6, mb: 8, px: { xs: 2, sm: 3, md: 4 } }}>

        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Explore Snippets
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Browse code snippets shared by the community
          </Typography>
        </Box>

        {errorPublic && <Typography color="error" sx={{ mb: 2 }}>{errorPublic}</Typography>}

        {/* Filters */}
        <FiltersBar
          values={publicFilters}
          onChange={setPublicFilters}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        {/* Snippet Grid */}
        <Box sx={{ mt: 5 }}>
          {loadingPublic ? (
            <Typography>Loading public snippets...</Typography>
          ) : publicItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="body1" color="text.secondary">
                No public snippets available yet.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {publicItems.map((snippet, index) => (
                <Grid key={snippet._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: 'flex' }}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      minWidth: 0,
                      overflow: 'hidden',
                      transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                    }}
                    onClick={() => handleOpenView(snippet, publicItems, index)}
                  >
                    <CardContent sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <Chip
                        label={snippet.language}
                        size="small"
                        sx={{ mb: 1, backgroundColor: '#FFB300', color: '#1a1a1a', fontWeight: 600 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="div" noWrap sx={{ flex: 1, mr: 1 }}>
                          {snippet.title}
                        </Typography>
                      </Box>
                      {snippet.description && (
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                          {snippet.description}
                        </Typography>
                      )}
                      <CodeBlock code={snippet.code} language={snippet.language} maxHeight={96} overflow="hidden" />
                      {snippet.tags?.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {snippet.tags.map((tag, i) => (
                            <Chip
                              key={i}
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
              ))}
            </Grid>
          )}
        </Box>

        {/* Snippet View Dialog */}
        <Dialog open={viewOpen} onClose={handleCloseView} maxWidth="md" fullWidth keepMounted={false}>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{viewSnippet?.title}</Typography>
                {viewSnippet?.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                    {viewSnippet.description}
                  </Typography>
                )}
              </Box>
              <IconButton size="small" onClick={handleCloseView} sx={{ flexShrink: 0 }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip label={viewSnippet?.language} size="small" sx={{ backgroundColor: '#FFB300', color: '#1a1a1a', fontWeight: 600 }} />
              {viewSnippet?.tags?.map((tag, i) => (
                <Chip key={i} label={tag} size="small" sx={{ backgroundColor: 'rgba(255,179,0,0.12)', color: '#FFB300', border: '1px solid rgba(255,179,0,0.35)' }} />
              ))}
            </Box>
            <CodeBlock code={viewSnippet?.code || ''} language={viewSnippet?.language} maxHeight={480} />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Previous"><span>
                <IconButton size="small" onClick={handlePrevSnippet} disabled={viewIndex === 0}>
                  <NavigateBeforeIcon />
                </IconButton>
              </span></Tooltip>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 48, textAlign: 'center' }}>
                {viewIndex + 1} / {viewList.length}
              </Typography>
              <Tooltip title="Next"><span>
                <IconButton size="small" onClick={handleNextSnippet} disabled={viewIndex === viewList.length - 1}>
                  <NavigateNextIcon />
                </IconButton>
              </span></Tooltip>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button startIcon={<ContentCopyIcon />} size="small" onClick={handleCopyCode} variant="outlined" color={copied ? 'success' : 'primary'}>
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
              <Button onClick={handleCloseView} variant="contained">Close</Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default PublicSnippets;
