import express from 'express';
import Project from '../models/Project.js';
import { authenticate as auth } from '../middlewares/authMiddleware.js';
import { authorize as role } from '../middlewares/role.js';

const router = express.Router();

// Create project (admin)
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name) return res.status(400).json({ msg: 'Project name required' });

    const memberIds = Array.isArray(members) ? members : [];
    if (!memberIds.includes(req.user.id)) {
      memberIds.push(req.user.id);
    }
    const uniqueMembers = [...new Set(memberIds)];

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      members: uniqueMembers,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Create project failed' });
  }
});

// Get projects
router.get('/', auth, async (req, res) => {
  try {
    const filter =
      req.user.role === 'admin'
        ? {}
        : { members: { $in: [req.user.id] } };
    const projects = await Project.find(filter)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email role');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch projects failed' });
  }
});

// Add member to project (admin)
router.post('/:id/members', auth, role('admin'), async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId) return res.status(400).json({ msg: 'memberId required' });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    const exists = project.members.some(
      (existing) => existing.toString() === memberId,
    );
    if (!exists) {
      project.members.push(memberId);
      await project.save();
    }

    const populated = await Project.findById(project._id)
      .populate('members', 'name email role')
      .populate('createdBy', 'name email role');

    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Add member failed' });
  }
});

export default router;
