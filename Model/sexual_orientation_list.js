// list of interests for the user to choose from by admin
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const sexualorientationList = new schema({
  sexualOrientation: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("sexualorientationList", sexualorientationList);
