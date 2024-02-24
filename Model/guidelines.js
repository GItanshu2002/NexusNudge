// Guidlines for the user image 
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const guidelines = new schema({
  guidelines: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("guidelines", guidelines);
