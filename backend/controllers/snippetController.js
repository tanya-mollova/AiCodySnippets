import Snippet from '../models/Snippet.js';

// @desc    Get all snippets (user's own or public snippets)
// @route   GET /api/snippets
export const getSnippets = async (req, res) => {
  try {
    const { language, search, sort = '-createdAt' } = req.query;

    let filter;
    
    // If user is authenticated, show their own snippets (public or private)
    // Otherwise, show only public snippets
    if (req.user) {
      filter = { user: req.user._id };
    } else {
      filter = { isPublic: true };
    }

    if (language) {
      filter.language = language.toLowerCase();
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const snippets = await Snippet.find(filter).sort(sort).populate('user', 'username email');
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single snippet by ID
// @route   GET /api/snippets/:id
export const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id).populate('user', 'username email');

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Allow access if snippet is public or user owns it
    if (!snippet.isPublic && (!req.user || snippet.user._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(snippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new snippet
// @route   POST /api/snippets
// @access  Private
export const createSnippet = async (req, res) => {
  try {
    // Associate snippet with authenticated user
    const snippetData = {
      ...req.body,
      user: req.user._id,
    };
    
    const snippet = await Snippet.create(snippetData);
    const populatedSnippet = await Snippet.findById(snippet._id).populate('user', 'username email');
    res.status(201).json(populatedSnippet);
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
// @access  Private
export const updateSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Verify ownership
    if (snippet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this snippet' });
    }

    // Update snippet (don't allow changing the user)
    const { user, ...updateData } = req.body;
    
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('user', 'username email');

    res.status(200).json(updatedSnippet);
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
// @access  Private
export const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Verify ownership
    if (snippet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this snippet' });
    }

    await Snippet.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's snippets (private or public)
// @route   GET /api/snippets/my
// @access  Private
export const getMySnippets = async (req, res) => {
  try {
    const { language, search, sort = '-createdAt' } = req.query;

    const filter = { user: req.user._id };

    if (language) {
      filter.language = language.toLowerCase();
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const snippets = await Snippet.find(filter).sort(sort).populate('user', 'username email');
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all public snippets
// @route   GET /api/snippets/public
// @access  Public
export const getPublicSnippets = async (req, res) => {
  try {
    const { language, search, sort = '-createdAt' } = req.query;

    const filter = { isPublic: true };

    if (language) {
      filter.language = language.toLowerCase();
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const snippets = await Snippet.find(filter).sort(sort).populate('user', 'username email');
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
