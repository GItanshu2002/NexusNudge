// list of interests for the user to choose from by admin
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const interestList = new schema({
  interests: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("interestList", interestList);
