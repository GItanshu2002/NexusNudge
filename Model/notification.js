// save notification
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const notification = new schema({
  send_by: { type: schema.ObjectId, ref: "user", default: null },
  send_to: { type: schema.ObjectId, ref: "user", default: null },
  message: { type: String, default: null },
  type: {
    type: String,
    enum: [
      "swiplimit",
      "match",
      "profilelike",
      "message",
      "verification",
      "welcome",
      "plan",
    ],
    default: null,
  },
  title: { type: String, default: null },
  isRead: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("notification", notification);
