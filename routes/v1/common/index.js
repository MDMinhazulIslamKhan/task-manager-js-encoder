import express from "express";
import { CommonController } from "../../../controllers/common/index.js";

const router = express.Router();

// registration
router.post("/registration", CommonController.registration);

// login
router.get("/login", CommonController.login);

export const CommonRouters = router;
