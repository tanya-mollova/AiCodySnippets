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
    items: [],
    currentSnippet: null,
    loading: false,
    error: null,
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
        state.items.unshift(action.payload);
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
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
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
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearError, clearCurrentSnippet } = snippetsSlice.actions;
export default snippetsSlice.reducer;
