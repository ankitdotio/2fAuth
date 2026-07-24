import { app } from "./app.js";
import { config } from "./config/env.js";

console.log("hello");

const startApplication = () => {
  try {
    const server = app.listen(config.PORT ?? 3000);
    server.timeout = config.SERVER_REQUEST_TIMEOUT ?? 30 * 1000;
    console.info("SERVER IS UP AND RUNNING");
  } catch (error) {
    console.error("APPLICATION ERROR ", error);
  }
};

startApplication();
