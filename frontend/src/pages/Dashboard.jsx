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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Navbar } from '../components';
import {
  fetchSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
} from '../store/slices/snippetsSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { snippets, isLoading, isError, message } = useSelector(
    (state) => state.snippets
  );

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

  useEffect(() => {
    dispatch(fetchSnippets());
  }, [dispatch]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const snippetData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    if (editMode && currentSnippet) {
      dispatch(updateSnippet({ id: currentSnippet._id, snippetData }));
    } else {
      dispatch(createSnippet(snippetData));
    }

    handleCloseDialog();
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

        {isError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {message}
          </Typography>
        )}

        {isLoading ? (
          <Typography>Loading snippets...</Typography>
        ) : snippets.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No snippets yet. Create your first one!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {snippets.map((snippet) => (
              <Grid item xs={12} md={6} lg={4} key={snippet._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {snippet.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleVisibility(snippet)}
                        title={snippet.isPublic ? 'Make Private' : 'Make Public'}
                      >
                        {snippet.isPublic ? (
                          <VisibilityIcon color="primary" />
                        ) : (
                          <VisibilityOffIcon color="action" />
                        )}
                      </IconButton>
                    </Box>
                    <Chip
                      label={snippet.language}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    {snippet.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {snippet.description}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        backgroundColor: '#f5f5f5',
                        p: 1,
                        borderRadius: 1,
                        maxHeight: 100,
                        overflow: 'auto',
                      }}
                    >
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{ fontSize: '0.75rem', margin: 0 }}
                      >
                        {snippet.code.substring(0, 150)}
                        {snippet.code.length > 150 ? '...' : ''}
                      </Typography>
                    </Box>
                    {snippet.tags && snippet.tags.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {snippet.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mt: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(snippet)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(snippet._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

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
                <InputLabel>Language</InputLabel>
                <Select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  label="Language"
                >
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="csharp">C#</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                  <MenuItem value="html">HTML</MenuItem>
                  <MenuItem value="css">CSS</MenuItem>
                  <MenuItem value="sql">SQL</MenuItem>
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
      </Container>
    </>
  );
}

export default Dashboard;
