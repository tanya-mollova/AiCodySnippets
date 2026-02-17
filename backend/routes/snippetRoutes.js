import express from 'express';
import {
  getSnippets,
  getSnippetById,
  createSnippet,
  updateSnippet,
  deleteSnippet,
} from '../controllers/snippetController.js';

const router = express.Router();

router.route('/').get(getSnippets).post(createSnippet);
router.route('/:id').get(getSnippetById).put(updateSnippet).delete(deleteSnippet);

export default router;
