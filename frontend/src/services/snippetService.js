import api from './api';

// Get all snippets with optional filters
export const getSnippets = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.language) params.append('language', filters.language);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);
  
  const response = await api.get(`/snippets?${params.toString()}`);
  return response.data;
};

// Get a single snippet by ID
export const getSnippetById = async (id) => {
  const response = await api.get(`/snippets/${id}`);
  return response.data;
};

// Create a new snippet
export const createSnippet = async (snippetData) => {
  const response = await api.post('/snippets', snippetData);
  return response.data;
};

// Update a snippet
export const updateSnippet = async (id, snippetData) => {
  const response = await api.put(`/snippets/${id}`, snippetData);
  return response.data;
};

// Delete a snippet
export const deleteSnippet = async (id) => {
  const response = await api.delete(`/snippets/${id}`);
  return response.data;
};
