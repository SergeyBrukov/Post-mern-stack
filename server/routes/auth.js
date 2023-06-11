import { Router } from 'express';
import { register, login, getMe } from '../controlers/authController.js';
import { checkAuth } from '../utils/auth.midleware.js';

const router = Router();

//Register

router.post('/register', register);

//Login
router.post('/login', login);

//Get Me
router.get('/me', checkAuth, getMe);

export default router;
