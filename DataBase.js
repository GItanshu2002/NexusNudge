const mongoose = require("mongoose");

const database_connection = async () => {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/NexusNudge", {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    db.once("open", () => {
      console.log("Connected to MongoDB");
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  database_connection: database_connection,
};
