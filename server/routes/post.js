import { Router } from 'express';
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
  editPostById,
  getMyPosts,
  getPostBySearch,
  getMyPostBySearch,
} from '../controlers/postContoroller.js';
import { checkAuth } from '../utils/auth.midleware.js';

const router = Router();

router.post('/create-post', checkAuth, createPost);
router.get('/posts', getPosts);
router.get('/my-posts', checkAuth, getMyPosts);

router.get('/:id', getPostById);
router.get('/search/:searchValue', getPostBySearch);
router.get('/search-for-my-colection/:searchValue', checkAuth, getMyPostBySearch);
router.delete('/:id', checkAuth, deletePostById);
router.post('/:id', checkAuth, editPostById);

export default router;
