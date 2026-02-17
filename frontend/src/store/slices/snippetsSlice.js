import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as snippetService from '../../services/snippetService';

// Async thunks
export const fetchSnippets = createAsyncThunk(
  'snippets/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await snippetService.getSnippets(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch snippets');
    }
  }
);

// Fetch current user's snippets
export const fetchMySnippets = createAsyncThunk(
  'snippets/fetchMy',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await snippetService.getMySnippets(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my snippets');
    }
  }
);

// Fetch public snippets
export const fetchPublicSnippets = createAsyncThunk(
  'snippets/fetchPublic',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const data = await snippetService.getPublicSnippets(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch public snippets');
    }
  }
);

export const fetchSnippetById = createAsyncThunk(
  'snippets/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await snippetService.getSnippetById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch snippet');
    }
  }
);

export const createSnippet = createAsyncThunk(
  'snippets/create',
  async (snippetData, { rejectWithValue }) => {
    try {
      const data = await snippetService.createSnippet(snippetData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create snippet');
    }
  }
);

export const updateSnippet = createAsyncThunk(
  'snippets/update',
  async ({ id, snippetData }, { rejectWithValue }) => {
    try {
      const data = await snippetService.updateSnippet(id, snippetData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update snippet');
    }
  }
);

export const deleteSnippet = createAsyncThunk(
  'snippets/delete',
  async (id, { rejectWithValue }) => {
    try {
      await snippetService.deleteSnippet(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete snippet');
    }
  }
);

// Slice
const snippetsSlice = createSlice({
  name: 'snippets',
  initialState: {
    items: [], // legacy list
    myItems: [],
    publicItems: [],
    loadingMy: false,
    loadingPublic: false,
    currentSnippet: null,
    loading: false,
    error: null,
    errorMy: null,
    errorPublic: null,
    filters: {
      language: '',
      search: '',
      sort: '-createdAt',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSnippet: (state) => {
      state.currentSnippet = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all snippets
      .addCase(fetchSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnippets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSnippets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my snippets
      .addCase(fetchMySnippets.pending, (state) => {
        state.loadingMy = true;
        state.errorMy = null;
      })
      .addCase(fetchMySnippets.fulfilled, (state, action) => {
        state.loadingMy = false;
        state.myItems = action.payload;
      })
      .addCase(fetchMySnippets.rejected, (state, action) => {
        state.loadingMy = false;
        state.errorMy = action.payload;
      })
      // Fetch public snippets
      .addCase(fetchPublicSnippets.pending, (state) => {
        state.loadingPublic = true;
        state.errorPublic = null;
      })
      .addCase(fetchPublicSnippets.fulfilled, (state, action) => {
        state.loadingPublic = false;
        state.publicItems = action.payload;
      })
      .addCase(fetchPublicSnippets.rejected, (state, action) => {
        state.loadingPublic = false;
        state.errorPublic = action.payload;
      })
      // Fetch snippet by ID
      .addCase(fetchSnippetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnippetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSnippet = action.payload;
      })
      .addCase(fetchSnippetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create snippet
      .addCase(createSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSnippet.fulfilled, (state, action) => {
        state.loading = false;
        // Always add to myItems
        state.myItems.unshift(action.payload);
        // If created as public, also reflect in publicItems
        if (action.payload && action.payload.isPublic) {
          // Avoid duplicates by checking existing id
          const exists = state.publicItems.some((item) => item._id === action.payload._id);
          if (!exists) {
            state.publicItems.unshift(action.payload);
          }
        }
      })
      .addCase(createSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update snippet
      .addCase(updateSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSnippet.fulfilled, (state, action) => {
        state.loading = false;
        const indexMy = state.myItems.findIndex((item) => item._id === action.payload._id);
        if (indexMy !== -1) {
          state.myItems[indexMy] = action.payload;
        }
        // Keep publicItems in sync
        const indexPublic = state.publicItems.findIndex((item) => item._id === action.payload._id);
        if (action.payload.isPublic) {
          if (indexPublic !== -1) {
            state.publicItems[indexPublic] = action.payload;
          } else {
            // Newly made public; add to top
            state.publicItems.unshift(action.payload);
          }
        } else if (indexPublic !== -1) {
          // Became private; remove from public list
          state.publicItems.splice(indexPublic, 1);
        }
        state.currentSnippet = action.payload;
      })
      .addCase(updateSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete snippet
      .addCase(deleteSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.myItems = state.myItems.filter((item) => item._id !== action.payload);
        state.publicItems = state.publicItems.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearError, clearCurrentSnippet } = snippetsSlice.actions;
export default snippetsSlice.reducer;
