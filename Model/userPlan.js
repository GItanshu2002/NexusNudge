// user plan
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const savePlan = new schema({
  planId: { type: schema.ObjectId, ref: "membership", default: null },
  userId: { type: schema.ObjectId, ref: "user", default: null },
  active: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("savePlan", savePlan);
