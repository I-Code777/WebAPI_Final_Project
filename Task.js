const mongoose = require('mongoose');

// Define the schema for a task
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Task name is mandatory
  },
  description: {
    type: String,
    required: true, // Task description is mandatory
  },
  dueDate: {
    type: Date,
    required: true, // Task due date is mandatory
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'], // Priority can be Low, Medium, or High
    required: true, // Priority is mandatory
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model to allow sharing tasks with other users
    },
  ],
  category: {
    type: String,
    required: true, // Task category is mandatory
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User who created the task
    required: true, // The task must have a creator
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set update date
  },
});

// Update the `updatedAt` field every time the task is modified
taskSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create a model from the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;