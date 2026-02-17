import express from 'express';
import {
  getSnippets,
  getSnippetById,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  getMySnippets,
  getPublicSnippets,
} from '../controllers/snippetController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getSnippets).post(protect, createSnippet);
router.get('/my', protect, getMySnippets);
router.get('/public', getPublicSnippets);
router.route('/:id').get(getSnippetById).put(protect, updateSnippet).delete(protect, deleteSnippet);

export default router;
