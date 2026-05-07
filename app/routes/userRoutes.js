import express from 'express';
import User from '../models/User.js';
import { authenticate as auth } from '../middlewares/authMiddleware.js';
import { authorize as role } from '../middlewares/role.js';

const router = express.Router();

// Current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email role');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch profile failed' });
  }
});

// List users (admin)
router.get('/', auth, role('admin'), async (req, res) => {
  try {
    const users = await User.find().select('name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch users failed' });
  }
});

export default router;
