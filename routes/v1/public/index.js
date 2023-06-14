import express from "express";
import { PublicController } from "../../../controllers/public/index.js";

const router = express.Router();

// create task
router.post("/create-task", PublicController.createTask);

// update task
router.patch("/update-task", PublicController.updateTask);

// delete task
router.delete("/delete-task", PublicController.deleteTask);

export const PublicRouters = router;
