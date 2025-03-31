const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
import dotenv from "dotenv";

dotenv.config();
export const connect = mongoose.connection;
mongoose.set("strictQuery", true);

const MODE = process.env.NODE_ENV === "production";
const serverURl =
  process.env.MONGO_URL || "mongodb://localhost:27017/my_database";

/**
 * Mongodb Connector
 * @param {string} [url] Mongodb Url `Optional`
 */
export const connectDB = async (serverUrl: string = serverURl) => {
  connect.on("connected", async () => {
    console.log(
      "MongoDB Connection Established, Running in " + process.env.NODE_ENV, process.env.PORT
    );
  });

  connect.on("reconnected", async () => {
    console.log("MongoDB Connection Reestablished");
  });

  connect.on("disconnected", () => {
    console.log("Mongo Connection Disconnected");
    console.log("Trying to reconnect to Mongo ...");

    setTimeout(() => {
      mongoose.connect(serverUrl, {
        useUnifiedTopology: true,
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      });
    }, 3000);
  });

  connect.on("close", () => {
    console.log("Mongo Connection Closed");
  });
  connect.on("error", (error: Error) => {
    console.log("Mongo Connection ERROR: " + error);
  });

  await mongoose
    .connect(serverUrl, {
      useUnifiedTopology: true,
      socketTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    })
    .catch((error: Error) => console.log(error));
};

exports = { connectDB, connect };
