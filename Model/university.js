// university for the user to add
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const university = new schema({
  university: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("university", university);
