import jwt from "jsonwebtoken";
import config from "../../config/index.js";

export const isUser = async (req, res, next) => {
  const token = req?.headers?.authorization;
  try {
    const decoded = jwt.verify(token, config.secret_key);
    if (decoded) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Access Denied",
      });
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }
};
