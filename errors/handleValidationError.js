import mongoose from "mongoose";
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => {
    return {
      path: el?.path,
      message: el?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation error",
    errorMessages: errors,
  };
};

export default handleValidationError;
