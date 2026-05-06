import { Router } from 'express';
import { signup, login } from '../controllers/authController';

router.post('/signup', signup);
router.post('/login', login);
export default router = Router();
