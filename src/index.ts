import { app } from "./app.js";
import { connectDb } from "./config/db.config.js";
import { config } from "./config/env.js";

console.log("hello");

const startApplication = async () => {
  try {
    /**
     * DATABASE CONNECTION
     */
    const dbName = await connectDb();
    console.log('INSIDE " index.ts " DATABASE CONNECTED', dbName);

    /**
     * STARTING UP THE SERVER
     */
    const server = app.listen(config.PORT ?? 3000);
    server.timeout = config.SERVER_REQUEST_TIMEOUT ?? 30 * 1000;
    console.info("SERVER IS UP AND RUNNING");
  } catch (error) {
    console.error("APPLICATION ERROR ", error);
  }
};

startApplication();
