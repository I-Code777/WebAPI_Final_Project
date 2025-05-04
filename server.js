const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./User');
const Task = require('./Task'); // Import Task model
const authJwtController = require('./auth_jwt'); // JWT auth middleware

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

// MongoDB connection (mongoose)
mongoose.connect('mongodb+srv://test:test123@webapifinal.l5sjtry.mongodb.net/webapifinal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const SECRET_KEY = process.env.SECRET_KEY;

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

const router = express.Router();

// SIGNUP ROUTE (Create a new user)
router.post('/signup', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ success: false, msg: 'Please include both username and password to signup.' });
  }

  try {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });

    await user.save();
    res.status(201).json({ success: true, msg: 'Successfully created new user.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'A user with that username already exists.' });
    } else {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
    }
  }
});

// SIGNIN ROUTE (Authenticate and provide JWT token)
router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select('name username password');

    if (!user) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
    }

    const isMatch = await user.comparePassword(req.body.password);

    if (isMatch) {
      const userToken = { id: user._id, username: user.username };
      const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.json({ success: true, token: 'JWT ' + token });
    } else {
      res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
});

// USER CRUD ROUTES=====================================================================================================================
// USER CRUD ROUTES

// Get User Profile
router.get('/user', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
});

// Update User Profile
router.put('/user', authJwtController.isAuthenticated, async (req, res) => {
  const { name, password } = req.body;

  if (!name && !password) {
    return res.status(400).json({ success: false, message: 'Please provide at least one field to update (name or password).' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name;
    if (password) user.password = await user.hashPassword(password); // assuming you have a hashPassword method

    await user.save();
    res.status(200).json({ success: true, message: 'User profile updated successfully.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update user profile.' });
  }
});

// Delete User Account
router.delete('/user', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Delete associated tasks before deleting the user (optional)
    await Task.deleteMany({ createdBy: req.user.id });

    // Delete the user
    await user.remove();
    res.status(200).json({ success: true, message: 'User account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete user account.' });
  }
});

// TASK CRUD ROUTES=====================================================================================================================

// Create a new task
router.post('/tasks', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const newTask = new Task({
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      sharedWith: req.body.sharedWith,
      category: req.body.category,
      createdBy: req.user.id, // JWT user ID
    });

    await newTask.save();
    res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
});

// Get all tasks for a user
router.get('/tasks', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id });
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
});

// Update a task
router.put('/tasks/:id', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Ensure the task belongs to the user trying to update it
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this task.' });
    }

    // Update task properties
    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.priority = req.body.priority || task.priority;
    task.sharedWith = req.body.sharedWith || task.sharedWith;
    task.category = req.body.category || task.category;

    await task.save();
    res.status(200).json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
});

// Delete a task
router.delete('/tasks/:id', authJwtController.isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Ensure the task belongs to the user trying to delete it
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this task.' });
    }

    await task.remove();
    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
});

// MOUNT ROUTER & EXPORT APP
app.use('/api', router);

module.exports = app;