import express from "express";
import cors from "cors";

import globalErrorHandler from "./middleware/common/globalErrorHandler.js";
import { CommonRouters } from "./routes/v1/common/index.js";
import { PublicRouters } from "./routes/v1/public/index.js";
import { isUser } from "./middleware/public/index.js";

const app = express();
app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Welcome route
app.get("/", (req, res) => {
  return res.status(200).send("Welcome in Test Task application!");
});

// application common routes
app.use("/api/v1/common", CommonRouters);

// application public routes
app.use("/api/v1/public", isUser, PublicRouters);

//No route
app.all("*", (req, res) => {
  const route = req.params;
  return res.status(404).send(`No Route found in "${route[0]}" !`);
});

// Error handler
app.use(globalErrorHandler);

export default app;
