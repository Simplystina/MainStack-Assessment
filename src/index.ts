import logger from "jet-logger";
import server from "./server";
import { connectDB } from "./database/index";
import dotenv from "dotenv"

dotenv.config();
// Database Connector
connectDB();
// **** Run **** //

const SERVER_START_MSG =
  "Express server started on port: " + (process.env.PORT as string).toString();

server.listen(process.env.PORT, () => logger.info(SERVER_START_MSG));
