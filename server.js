import mongoose from "mongoose";
import app from "./index.js";
import config from "./config/index.js";

async function main() {
  try {
    await mongoose.connect(`${config.database_url}/${config.database_name}`);
    console.log(`Database is connected on port ${config.port}`);

    app.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(`Failed to connect database, ${error}`);
  }
}

main();
