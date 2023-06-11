import {
  addCommentByPost,
  getCommentsByPost,
  deleteCommentById,
  addLikeOrDisLikeFetch,
} from '../controlers/commentController.js';

import { Router } from 'express';
import { checkAuth } from '../utils/auth.midleware.js';

const router = Router();

router.get('/comments/:postId', getCommentsByPost);
router.post('/add-comment/:postId', checkAuth, addCommentByPost);
router.post('/grade/:commentId', checkAuth, addLikeOrDisLikeFetch);
router.delete('/delete/:commentId/:postId', checkAuth, deleteCommentById);

export default router;
