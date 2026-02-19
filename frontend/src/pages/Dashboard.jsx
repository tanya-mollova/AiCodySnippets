/**
 * @description A React component that renders the main snippets dashboard with personal and public snippet management.
 * 
 * @usage This component is used as the authenticated home page, allowing users to create, edit, filter, view and delete their own snippets and browse public snippets.
 * 
 * @param {Object} props - The component props
 * @returns {JSX.Element} The rendered component
 * 
 * @example
 * <Dashboard />
 */
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
  fetchPublicSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
} from '../store/slices/snippetsSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { myItems, publicItems, loadingMy, loadingPublic, errorMy, errorPublic, error, loading } = useSelector(
    (state) => state.snippets
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSnippet, setViewSnippet] = useState(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [viewList, setViewList] = useState([]);
  const [copied, setCopied] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: '',
    isPublic: false,
  });

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
    const nextIndex = viewIndex + 1;
    if (nextIndex < viewList.length) {
      setViewIndex(nextIndex);
      setViewSnippet(viewList[nextIndex]);
      setCopied(false);
    }
  };

  const handlePrevSnippet = () => {
    const prevIndex = viewIndex - 1;
    if (prevIndex >= 0) {
      setViewIndex(prevIndex);
      setViewSnippet(viewList[prevIndex]);
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

  const [myFilters, setMyFilters] = useState({ language: '', search: '', sort: '-createdAt' });
  const [publicFilters, setPublicFilters] = useState({ language: '', search: '', sort: '-createdAt' });

  useEffect(() => {
    dispatch(fetchMySnippets(myFilters));
    dispatch(fetchPublicSnippets(publicFilters));
  }, [dispatch]);

  const applyMyFilters = (values) => {
    setMyFilters(values);
    dispatch(fetchMySnippets(values));
  };

  const resetMyFilters = () => {
    const defaults = { language: '', search: '', sort: '-createdAt' };
    setMyFilters(defaults);
    dispatch(fetchMySnippets(defaults));
  };

  const applyPublicFilters = (values) => {
    setPublicFilters(values);
    dispatch(fetchPublicSnippets(values));
  };

  const resetPublicFilters = () => {
    const defaults = { language: '', search: '', sort: '-createdAt' };
    setPublicFilters(defaults);
    dispatch(fetchPublicSnippets(defaults));
  };

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
      setFormData({
        title: '',
        description: '',
        code: '',
        language: 'javascript',
        tags: '',
        isPublic: false,
      });
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isPublic' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const snippetData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    try {
      if (editMode && currentSnippet) {
        await dispatch(updateSnippet({ id: currentSnippet._id, snippetData })).unwrap();
        setSnackbar({ open: true, message: 'Snippet updated successfully!', severity: 'success' });
        await dispatch(fetchMySnippets(myFilters));
      } else {
        const created = await dispatch(createSnippet(snippetData)).unwrap();
        setSnackbar({ open: true, message: 'Snippet created successfully!', severity: 'success' });
        // Keep lists in sync with server-side filters and ordering
        await dispatch(fetchMySnippets(myFilters));
        if (created?.isPublic) {
          await dispatch(fetchPublicSnippets(publicFilters));
        }
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: err || 'Failed to save snippet. Please check all required fields.', severity: 'error' });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      dispatch(deleteSnippet(id));
    }
  };

  const handleToggleVisibility = (snippet) => {
    dispatch(
      updateSnippet({
        id: snippet._id,
        snippetData: { ...snippet, isPublic: !snippet.isPublic },
      })
    );
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            My Snippets
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Snippet
          </Button>
        </Box>

        {(errorMy || errorPublic) && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMy || errorPublic}
          </Typography>
        )}

        {/* My Snippets Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>My Snippets</Typography>
          <FiltersBar
            values={myFilters}
            onChange={setMyFilters}
            onApply={applyMyFilters}
            onReset={resetMyFilters}
            rightActions={(
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                Add Snippet
              </Button>
            )}
          />
        </Box>
        {loadingMy ? (
          <Typography>Loading your snippets...</Typography>
        ) : myItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body1" color="text.secondary">
              No personal snippets yet. Use "Add Snippet" to create one.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {myItems.map((snippet, index) => (
              <Grid item xs={12} md={6} lg={4} key={snippet._id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                  }}
                  onClick={() => handleOpenView(snippet, myItems, index)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="div" noWrap sx={{ flex: 1, mr: 1 }}>
                        {snippet.title}
                      </Typography>
                      <Tooltip title={snippet.isPublic ? 'Make Private' : 'Make Public'}>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleToggleVisibility(snippet); }}
                        >
                          {snippet.isPublic ? (
                            <VisibilityIcon color="primary" />
                          ) : (
                            <VisibilityOffIcon color="action" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Chip
                      label={snippet.language}
                      size="small"
                      sx={{ mb: 1, backgroundColor: '#FFB300', color: '#1a1a1a', fontWeight: 600 }}
                    />
                    {snippet.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                        {snippet.description}
                      </Typography>
                    )}
                    <CodeBlock code={snippet.code} language={snippet.language} maxHeight={96} overflow="hidden" />
                    {snippet.tags && snippet.tags.length > 0 && (
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

        {/* Public Snippets Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>Public Snippets</Typography>
          <FiltersBar
            values={publicFilters}
            onChange={setPublicFilters}
            onApply={applyPublicFilters}
            onReset={resetPublicFilters}
          />
        </Box>
        {loadingPublic ? (
          <Typography>Loading public snippets...</Typography>
        ) : publicItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body1" color="text.secondary">
              No public snippets available.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {publicItems.map((snippet, index) => (
              <Grid item xs={12} md={6} lg={4} key={snippet._id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                  }}
                  onClick={() => handleOpenView(snippet, publicItems, index)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="div" noWrap sx={{ flex: 1, mr: 1 }}>
                        {snippet.title}
                      </Typography>
                      <Chip label="Public" size="small" color="primary" />
                    </Box>
                    <Chip
                      label={snippet.language}
                      size="small"
                      sx={{ mb: 1, backgroundColor: '#FFB300', color: '#1a1a1a', fontWeight: 600 }}
                    />
                    {snippet.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                        {snippet.description}
                      </Typography>
                    )}
                    <CodeBlock code={snippet.code} language={snippet.language} maxHeight={96} overflow="hidden" />
                    {snippet.tags && snippet.tags.length > 0 && (
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

        {/* Snippet View Dialog */}
        <Dialog
          open={viewOpen}
          onClose={handleCloseView}
          maxWidth="md"
          fullWidth
          keepMounted={false}
        >
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
                {viewIndex + 1} / {viewList.length}
              </Typography>
              <Tooltip title="Next snippet">
                <span>
                  <IconButton size="small" onClick={handleNextSnippet} disabled={viewIndex === viewList.length - 1}>
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

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{editMode ? 'Edit Snippet' : 'Add New Snippet'}</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                required
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Programming Language</InputLabel>
                <Select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  label="Programming Language"
                >
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
              <TextField
                fullWidth
                required
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                multiline
                rows={10}
                sx={{ mb: 2 }}
                placeholder="Enter your code here..."
              />
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., react, hooks, frontend"
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                  />
                }
                label="Make this snippet public"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default Dashboard;
