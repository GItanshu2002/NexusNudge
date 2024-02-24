// terms & condtions schema
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const termsConditions = new schema({
  termsConditions: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("terms&Condition", termsConditions);
