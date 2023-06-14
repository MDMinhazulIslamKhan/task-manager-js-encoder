import jwt from "jsonwebtoken";
import config from "../../config/index.js";
import Task from "../../models/taskModel.js";
import mongoose from "mongoose";
import User from "../../models/userModel.js";

const createTask = async (req, res, next) => {
  const { title, description, dueDate, status, assignUsersId } = req.body;
  const token = req?.headers?.authorization;
  const decoded = jwt.verify(token, config.secret_key);
  let assignUser;

  if (assignUsersId && !mongoose.Types.ObjectId.isValid(assignUsersId)) {
    return res.status(404).send({
      success: false,
      message: `No user with this assignUsersId (${assignUsersId})`,
    });
  } else if (assignUsersId) {
    assignUser = await User.findOne({ _id: assignUsersId });
    if (!assignUser) {
      return res.status(404).send({
        success: false,
        message: `No user with this assignUsersId (${assignUsersId})`,
      });
    }
  }

  if (!title || !description || !dueDate) {
    return res.status(400).json({
      success: false,
      message: "You must give title, description and dueDate.",
    });
  }

  if (
    status &&
    status !== "progress" &&
    status !== "completed" &&
    status !== "pending"
  ) {
    return res.status(400).json({
      success: false,
      message: "You must give task status progress, completed or pending",
    });
  }

  const newTask = new Task({
    title,
    description,
    dueDate: new Date(dueDate),
    status: status ? status : "pending",
    creator: {
      _id: decoded?.id,
      name: decoded?.name,
    },
    assign: {
      _id: assignUsersId ? assignUsersId : decoded?.id,
      name: assignUser ? assignUser?.name : decoded?.name,
    },
  });
  try {
    await newTask.save();
    return res.status(201).json({
      success: true,
      message: "Task Added Successfully",
      newTask,
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: error,
    });
  }
};

const updateTask = async (req, res, next) => {
  const { taskId } = req.query;
  const { title, description, dueDate, status, assignUsersId } = req.body;
  const token = req?.headers?.authorization;
  const decoded = jwt.verify(token, config.secret_key);
  let assignUser;
  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).send({
        success: false,
        message: `No task with this taskId (${taskId})`,
      });
    }
    if (assignUsersId && !mongoose.Types.ObjectId.isValid(assignUsersId)) {
      return res.status(404).send({
        success: false,
        message: `No user with this assignUsersId (${assignUsersId})`,
      });
    } else if (assignUsersId) {
      assignUser = await User.findOne({ _id: assignUsersId });
      if (!assignUser) {
        return res.status(404).send({
          success: false,
          message: `No user with this assignUsersId (${assignUsersId})`,
        });
      }
    }
    const task = await Task.findOne({ _id: taskId });

    if (task?.creator._id !== decoded.id) {
      return res.status(404).send({
        success: false,
        message: `You have no access to edit this task.`,
      });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        dueDate,
        status,
        assign: {
          _id: assignUsersId,
          name: assignUser.name,
        },
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send({
        success: false,
        message: `No task with this taskId (${taskId})`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Task updated Successfully",
      updatedTask,
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: error,
    });
  }
};

const deleteTask = async (req, res, next) => {
  const { taskId } = req.query;
  const token = req?.headers?.authorization;
  const decoded = jwt.verify(token, config.secret_key);

  try {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).send({
        success: false,
        message: `No task with this taskId (${taskId})`,
      });
    }

    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).send({
        success: false,
        message: `No task with this taskId (${taskId})`,
      });
    }
    console.log(decoded);
    if (task?.creator._id !== decoded.id) {
      return res.status(404).send({
        success: false,
        message: `You have no access to delete this task.`,
      });
    }

    const data = await Task.findByIdAndRemove(taskId);
    const message = data
      ? "Task deleted Successfully"
      : `No task exist with this taskId`;

    return res.status(201).json({
      success: true,
      message: message,
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: error,
    });
  }
};

const filterTask = async (req, res, next) => {
  const token = req?.headers?.authorization;
  const decoded = jwt.verify(token, config.secret_key);
  const { dueDate, status, assignUsersId } = req.query;
  const filter = {};

  try {
    if (dueDate) {
      filter.dueDate = { $gte: new Date(dueDate) };
    }

    if (status) {
      filter.status = status;
    }

    if (assignUsersId) {
      filter["assign.name"] = assignUsersId;
    }

    const tasks = await Task.find({
      $and: [{ "assign._id": decoded.id }, filter],
    });

    res.json(tasks);
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: error,
    });
  }
};

const sortTask = async (req, res, next) => {
  const token = req?.headers?.authorization;
  const decoded = jwt.verify(token, config.secret_key);
  const { sortby, order } = req.query;
  try {
    const sort = {};

    if (sortby === "dueDate") {
      sort.dueDate = order === "desc" ? -1 : 1;
    }

    if (sortby === "status") {
      sort.status = order === "desc" ? -1 : 1;
    }

    if (sortby === "assigned") {
      sort["assign.name"] = order === "desc" ? -1 : 1;
    }

    const tasks = await Task.find({ "assign._id": decoded.id }).sort(sort);

    res.json(tasks);
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: error,
    });
  }
};

const userNotification = async (req, res, next) => {
  const token = req?.headers?.authorization;
  const decoded = jwt.verify(token, config.secret_key);

  try {
    const notification = await Task.find({
      $and: [
        { "assign._id": decoded.id },
        { status: { $in: ["progress", "pending"] } },
      ],
    }).select("title dueDate assign.name status");
    return res.status(404).send({
      success: true,
      message: notification,
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: error,
    });
  }
};

const updateTaskStatus = async (req, res, next) => {
  const token = req?.headers?.authorization;
  const decoded = jwt.verify(token, config.secret_key);
  const { status, taskId } = req.query;
  try {
    if (!status || !taskId) {
      return res.status(400).json({
        success: false,
        message: "You must give status and taskId.",
      });
    }
    if (
      status !== "progress" &&
      status !== "completed" &&
      status !== "pending"
    ) {
      return res.status(400).json({
        success: false,
        message: "You must give task status progress, completed or pending",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).send({
        success: false,
        message: `No task with this taskId (${taskId})`,
      });
    }
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
      return res.status(404).send({
        success: false,
        message: `No task with this taskId (${taskId})`,
      });
    }

    if (task?.assign?._id !== decoded.id) {
      return res.status(404).send({
        success: false,
        message: `You have no access to edit this task.`,
      });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        status,
      },
      { new: true }
    );

    return res.status(404).send({
      success: true,
      message: "Task updated Successfully",
      updatedTask,
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: error,
    });
  }
};

export const PublicController = {
  createTask,
  updateTask,
  deleteTask,
  filterTask,
  sortTask,
  userNotification,
  updateTaskStatus,
};
