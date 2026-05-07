import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { authenticate as auth } from '../middlewares/authMiddleware.js';
import { authorize as role } from '../middlewares/role.js';

const router = express.Router();

// Create task
router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const { title, description, status, assignedTo, projectId, dueDate } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ msg: 'Title and projectId required' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      status,
      assignedTo,
      projectId,
      dueDate,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Create task failed' });
  }
});

// Get tasks
router.get('/', auth, async (req, res) => {
  try {
    const filter =
      req.user.role === 'admin'
        ? {}
        : { assignedTo: req.user.id };

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email role')
      .populate('projectId', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Fetch tasks failed' });
  }
});

// Summary for dashboard
router.get('/summary', auth, async (req, res) => {
  try {
    const filter =
      req.user.role === 'admin'
        ? {}
        : { assignedTo: req.user.id };
    const now = new Date();

    const [total, todo, inProgress, done, overdue] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({ ...filter, status: 'todo' }),
      Task.countDocuments({ ...filter, status: 'in-progress' }),
      Task.countDocuments({ ...filter, status: 'done' }),
      Task.countDocuments({
        ...filter,
        status: { $ne: 'done' },
        dueDate: { $lt: now },
      }),
    ]);

    res.json({ total, todo, inProgress, done, overdue });
  } catch (err) {
    res.status(500).json({ msg: 'Summary failed' });
  }
});

// Update status
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const canEdit =
      req.user.role === 'admin' ||
      (task.assignedTo && task.assignedTo.toString() === req.user.id);
    if (!canEdit) return res.status(403).json({ msg: 'Access denied' });

    const update = {
      status: req.body.status || task.status,
      title: req.body.title || task.title,
      description: req.body.description ?? task.description,
      dueDate: req.body.dueDate ?? task.dueDate,
    };

    if (req.user.role === 'admin') {
      update.assignedTo = req.body.assignedTo ?? task.assignedTo;
      update.projectId = req.body.projectId ?? task.projectId;
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, update, {
      returnDocument: 'after',
    })
      .populate('assignedTo', 'name email role')
      .populate('projectId', 'name');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Update task failed' });
  }
});

export default router;
