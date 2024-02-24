const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let admin = new Schema({
  name: { type: String, default: null },
  email: { type: String, default: null },
  password: { type: String, default: null },
  image: { type: String, default: null },
  deviceToken: { type: String, default: null },
  deviceType: { type: String, enum: ["android", "ios"], default: "android" },
  accessToken: { type: String, default: null },
  tokenGenerateAt: { type: Number, default: 0 },
  createdAt: { type: Number, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("admin", admin);
