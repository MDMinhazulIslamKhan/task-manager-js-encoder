import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  database_name: process.env.DATABASE_NAME,
  secret_key: process.env.SECRET_KEY,
};
