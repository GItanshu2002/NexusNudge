// religion for the user to choose from
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const religion = new schema({
  religion: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("religion", religion);
