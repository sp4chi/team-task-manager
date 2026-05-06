import { Router } from 'express';
import Project from '../models/Project';
import auth from '../middleware/auth';
import role from '../middleware/role';

const router = Router();

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
