import express from "express";
import { PublicController } from "../../../controllers/public/index.js";

const router = express.Router();

// create task
router.post("/create-task", PublicController.createTask);

export const PublicRouters = router;
