import { Router } from 'express';
import { changePassword } from '../controlers/meInfoController.js';
import { checkAuth } from '../utils/auth.midleware.js';

const router = Router();
router.post('/change-password', checkAuth, changePassword);
export default router;
