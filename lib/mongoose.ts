/* import mongoose from "mongoose";

let isConnected = false; // Variable to track the connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI)
    return console.log("MONGODB_URI is not defined");

  if (isConnected) return console.log("=> using existing database connection");

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};
 */

// lib/mongoose.ts (or wherever connectToDB is defined)

import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "pricewise",
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err);
    });

    // 🔁 Wait until connection is truly open
    await new Promise((resolve, reject) => {
      const check = () => {
        if (mongoose.connection.readyState === 1) {
          console.log("✅ MongoDB connection is ready");
          isConnected = true;
          resolve(true);
        } else {
          console.log("⏳ Waiting for MongoDB to be ready...");
          setTimeout(check, 100); // retry every 100ms
        }
      };
      check();
    });

    console.log("Connection readyState:", mongoose.connection.readyState);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
