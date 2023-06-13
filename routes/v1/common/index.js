import express from "express";
import { UserController } from "../../../controllers/common/index.js";

const router = express.Router();

// registration
router.post("/registration", UserController.registration);

// login
router.get("/login", UserController.login);

export const UserRouters = router;
