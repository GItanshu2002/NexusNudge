// genderId for the user with different gender then the original
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const genderId = new schema({
  genderId: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("genderId", genderId);
