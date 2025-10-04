import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const connect = mongoose.connection;

    connect.on("connected", () => {
      console.log("Database connected");
    });

    connect.on("error", (err) => {
      console.error("Database connection error:", err);
      process.exit();
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}
