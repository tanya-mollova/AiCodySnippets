import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Navbar, FiltersBar, CodeBlock } from '../components';
import {
  fetchMySnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
} from '../store/slices/snippetsSlice';

function MySnippets() {
  const dispatch = useDispatch();
  const { myItems, loadingMy, errorMy } = useSelector((state) => state.snippets);

  const [myFilters, setMyFilters] = useState({ language: '', search: '', sort: '-createdAt' });

  // View popup state
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSnippet, setViewSnippet] = useState(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [viewList, setViewList] = useState([]);
  const [copied, setCopied] = useState(false);

  // Add/Edit dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: '',
    isPublic: false,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchMySnippets(myFilters));
  }, [dispatch]);

  const applyFilters = (values) => {
    setMyFilters(values);
    dispatch(fetchMySnippets(values));
  };

  const resetFilters = () => {
    const defaults = { language: '', search: '', sort: '-createdAt' };
    setMyFilters(defaults);
    dispatch(fetchMySnippets(defaults));
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

  // Add/Edit dialog handlers
  const handleOpenDialog = (snippet = null) => {
    if (snippet) {
      setEditMode(true);
      setCurrentSnippet(snippet);
      setFormData({
        title: snippet.title,
        description: snippet.description || '',
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags ? snippet.tags.join(', ') : '',
        isPublic: snippet.isPublic,
      });
    } else {
      setEditMode(false);
      setCurrentSnippet(null);
      setFormData({ title: '', description: '', code: '', language: 'javascript', tags: '', isPublic: false });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentSnippet(null);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'isPublic' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const snippetData = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editMode && currentSnippet) {
        await dispatch(updateSnippet({ id: currentSnippet._id, snippetData })).unwrap();
        setSnackbar({ open: true, message: 'Snippet updated successfully!', severity: 'success' });
      } else {
        await dispatch(createSnippet(snippetData)).unwrap();
        setSnackbar({ open: true, message: 'Snippet created successfully!', severity: 'success' });
      }
      await dispatch(fetchMySnippets(myFilters));
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: err || 'Failed to save snippet.', severity: 'error' });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      dispatch(deleteSnippet(id)).then(() => dispatch(fetchMySnippets(myFilters)));
    }
  };

  const handleToggleVisibility = (snippet) => {
    dispatch(updateSnippet({ id: snippet._id, snippetData: { ...snippet, isPublic: !snippet.isPublic } }))
      .then(() => dispatch(fetchMySnippets(myFilters)));
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            My Snippets
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add Snippet
          </Button>
        </Box>

        {errorMy && <Typography color="error" sx={{ mb: 2 }}>{errorMy}</Typography>}

        {/* Filters */}
        <FiltersBar
          values={myFilters}
          onChange={setMyFilters}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        {/* Snippet Grid */}
        <Box sx={{ mt: 3 }}>
          {loadingMy ? (
            <Typography>Loading your snippets...</Typography>
          ) : myItems.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="body1" color="text.secondary">
                No snippets yet. Hit <strong>Add Snippet</strong> to create your first one!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {myItems.map((snippet, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={snippet._id} sx={{ display: 'flex' }}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                    }}
                    onClick={() => handleOpenView(snippet, myItems, index)}
                  >
                    <CardContent sx={{ flex: 1 }}>
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
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                                              <Tooltip title={snippet.isPublic ? 'Make Private' : 'Make Public'}>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleToggleVisibility(snippet); }}
                          >
                            {snippet.isPublic
                              ? <VisibilityIcon color="primary" />
                              : <VisibilityOffIcon color="action" />}
                          </IconButton>
                        </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => { e.stopPropagation(); handleOpenDialog(snippet); }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleDelete(snippet._id); }}
                          sx={{ '&:hover': { color: 'error.main' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
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

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{editMode ? 'Edit Snippet' : 'Add New Snippet'}</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField fullWidth required label="Title" name="title" value={formData.title} onChange={handleChange} sx={{ mb: 2 }} />
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={2} sx={{ mb: 2 }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Programming Language</InputLabel>
                <Select name="language" value={formData.language} onChange={handleChange} label="Programming Language">
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="csharp">C#</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                  <MenuItem value="html">HTML</MenuItem>
                  <MenuItem value="css">CSS</MenuItem>
                  <MenuItem value="sql">SQL</MenuItem>
                  <MenuItem value="typescript">TypeScript</MenuItem>
                  <MenuItem value="go">Go</MenuItem>
                  <MenuItem value="rust">Rust</MenuItem>
                  <MenuItem value="php">PHP</MenuItem>
                  <MenuItem value="ruby">Ruby</MenuItem>
                  <MenuItem value="swift">Swift</MenuItem>
                  <MenuItem value="kotlin">Kotlin</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth required label="Code" name="code" value={formData.code} onChange={handleChange} multiline rows={10} sx={{ mb: 2 }} placeholder="Enter your code here..." />
              <TextField fullWidth label="Tags (comma-separated)" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g., react, hooks, frontend" sx={{ mb: 2 }} />
              <FormControlLabel
                control={<Switch name="isPublic" checked={formData.isPublic} onChange={handleChange} />}
                label="Make this snippet public"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">{editMode ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default MySnippets;
