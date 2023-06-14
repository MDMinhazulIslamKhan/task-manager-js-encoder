import jwt from "jsonwebtoken";
import config from "../../config/index.js";
import Task from "../../models/taskModel.js";
import mongoose from "mongoose";
import User from "../../models/userModel.js";

const createTask = async (req, res) => {
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

  if (status && status !== "true" && status !== "false") {
    return res.status(400).json({
      success: false,
      message: "You must give task status true or false",
    });
  }

  const newTask = new Task({
    title,
    description,
    dueDate: new Date(dueDate),
    status: status ? status : false,
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

export const PublicController = { createTask };
