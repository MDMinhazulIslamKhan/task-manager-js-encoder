import express from "express";
import cors from "cors";

import { UserRouters } from "./routes/v1/common/index.js";
import globalErrorHandler from "./middleware/common/globalErrorHandler.js";

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
app.use("/v1/common", UserRouters);

//No route
app.all("*", (req, res) => {
  const route = req.params;
  return res.status(404).send(`No Route found in "${route[0]}" !`);
});

app.use(globalErrorHandler);

export default app;
