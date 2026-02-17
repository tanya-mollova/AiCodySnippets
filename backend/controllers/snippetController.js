import Snippet from '../models/Snippet.js';

// @desc    Get all public snippets (with optional filters)
// @route   GET /api/snippets
export const getSnippets = async (req, res) => {
  try {
    const { language, search, sort = '-createdAt' } = req.query;

    const filter = { isPublic: true };

    if (language) {
      filter.language = language.toLowerCase();
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const snippets = await Snippet.find(filter).sort(sort);
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single snippet by ID
// @route   GET /api/snippets/:id
export const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    res.status(200).json(snippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new snippet
// @route   POST /api/snippets
export const createSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.create(req.body);
    res.status(201).json(snippet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a snippet
// @route   PUT /api/snippets/:id
export const updateSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    res.status(200).json(snippet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a snippet
// @route   DELETE /api/snippets/:id
export const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findByIdAndDelete(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    res.status(200).json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
