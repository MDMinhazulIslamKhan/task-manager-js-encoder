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
    return next(error);
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
      message: "Task updated Successfully",
      updatedTask,
    });
  } catch (error) {
    return next(error);
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
    res.json({ message: message });
  } catch (error) {
    return next(error);
  }
};

export const PublicController = { createTask, updateTask, deleteTask };
