const Task = require("../models/Task");
const { ERRORS, MESSAGES, TASK_STATUS } = require("../constants");

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: ERRORS.TASK_REQUIRED });
    }

    if (status && !TASK_STATUS.includes(status)) {
      return res.status(400).json({ message: ERRORS.INVALID_STATUS });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      status: status || "pending",
      dueDate,
    });

    res.status(201).json({
      message: MESSAGES.TASK_CREATED,
      task,
    });
  } catch (error) {
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks of logged-in user
 * @access  Private
 */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      message: MESSAGES.REQUEST_SUCCESS,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task
 * @access  Private
 */
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: ERRORS.TASK_NOT_FOUND });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: ERRORS.TASK_NOT_FOUND });
    }

    if (status) {
      if (!TASK_STATUS.includes(status)) {
        return res.status(400).json({ message: ERRORS.INVALID_STATUS });
      }
      task.status = status;
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();

    res.json({
      message: MESSAGES.TASK_UPDATED,
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: ERRORS.TASK_NOT_FOUND });
    }

    res.json({ message: MESSAGES.TASK_DELETED });
  } catch (error) {
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};
