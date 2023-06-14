import express from "express";
import { PublicController } from "../../../controllers/public/index.js";

const router = express.Router();

// create task
router.post("/create-task", PublicController.createTask);

// update task by task creator
router.patch("/update-task", PublicController.updateTask);

// delete task
router.delete("/delete-task", PublicController.deleteTask);

// filter task
router.get("/filter-task", PublicController.filterTask);

// sort task
router.get("/sort-task", PublicController.sortTask);

// notification for task
router.get("/notification", PublicController.userNotification);

// update task status by assigned user
router.patch("/update-task-status", PublicController.updateTaskStatus);

export const PublicRouters = router;
