// chat schema
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const recentchat = new schema({
  message_by: { type: schema.ObjectId, ref: "user", default: null },
  message_to: { type: schema.ObjectId, ref: "user", default: null },
  message: { type: String, default: null },
  message_type: {
    type: String,
    enum: ["text", "image", "video"],
    default: null,
  },
  media: [{ type: String, default: null }],
  message_deleted_by: [{ type: schema.ObjectId, ref: "user", default: null }],
  is_read: { type: Boolean, default: false },
  is_delivered: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("recentchat", recentchat);
