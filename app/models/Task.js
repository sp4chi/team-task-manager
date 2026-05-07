import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    dueDate: Date,
  },
  { timestamps: true },
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
