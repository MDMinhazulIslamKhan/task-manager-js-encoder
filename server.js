import mongoose from "mongoose";
import app from "./index.js";
import config from "./config/index.js";
import { logger } from "./shared/logger.js";

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

let server;

async function main() {
  try {
    await mongoose.connect(`${config.database_url}/${config.database_name}`);
    logger.info(`Database is connected on port ${config.port}`);

    server = app.listen(config.port, () => {
      logger.info(`Application listening on port ${config.port}`);
    });
  } catch (error) {
    logger.error(`Failed to connect database, ${error}`);
  }

  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();
