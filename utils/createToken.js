import jwt from "jsonwebtoken";
import config from "../config/index.js";

const createToken = (email, id, phonNumber, name) => {
  const token = jwt.sign(
    {
      email,
      id,
      phonNumber,
      name,
    },
    config.secret_key,
    { expiresIn: "24h" }
  );

  return token;
};

export default createToken;
