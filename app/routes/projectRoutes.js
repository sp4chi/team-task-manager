import express from 'express';
import Project from '../models/Project.js';
import { authenticate as auth } from '../middlewares/authMiddleware.js';
import { authorize as role } from '../middlewares/role.js';

const router = express.Router();

// Create project (admin)
router.post('/', auth, role('admin'), async (req, res) => {
  const project = await Project.create({
    ...req.body,
    createdBy: req.user.id,
  });
  res.json(project);
});

// Get projects
router.get('/', auth, async (req, res) => {
  const projects = await Project.find().populate('members');
  res.json(projects);
});

export default router;
