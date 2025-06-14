import "dotenv/config";

import mongoose from "mongoose";

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "pricewise", // or your actual db name
    });

    console.log("✅ Connected to MongoDB!");

    const ping = await mongoose.connection.db.admin().ping();
    console.log("✅ Ping successful:", ping);

    // Close connection after test
    await mongoose.disconnect();
    console.log("✅ Disconnected");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
};

test();
