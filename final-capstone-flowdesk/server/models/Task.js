import mongoose from 'mongoose'

const STATUSES = ['todo', 'in-progress', 'done']
const PRIORITIES = ['low', 'medium', 'high']

const taskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150,
    },
    description: { type: String, trim: true, maxlength: 2000 },
    status: { type: String, enum: STATUSES, default: 'todo' },
    priority: { type: String, enum: PRIORITIES, default: 'medium' },
    dueDate: { type: Date },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attachmentUrl: { type: String },
    attachmentName: { type: String },
  },
  { timestamps: true }
)

export const TASK_STATUSES = STATUSES
export const TASK_PRIORITIES = PRIORITIES
export default mongoose.model('Task', taskSchema)
