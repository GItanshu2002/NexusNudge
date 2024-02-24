// genderId for the user with different gender then the original
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const like_dislike = new schema({
  liked_by: { type: schema.ObjectId, ref: "user", default: null },
  liked_to: { type: schema.ObjectId, ref: "user", default: null },
  like_dislike: {
    type: String,
    enum: ["like", "dislike"],
    default: "dislike",
  },
  matched: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("like_dislike", like_dislike);
