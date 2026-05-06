import { Router } from 'express';
import Task from '../models/Task.js';
import { authenticate as auth } from '../middlewares/authMiddleware.js';

const router = Router();

// Create task
router.post('/', auth, async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

// Get tasks
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find().populate('assignedTo');
  res.json(tasks);
});

// Update status
router.patch('/:id', auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(task);
});

export default router;
