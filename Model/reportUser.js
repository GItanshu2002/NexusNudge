// report a user
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const report_user = new schema({
  report_by: { type: schema.ObjectId, ref: "user", default: null },
  report_to: { type: schema.ObjectId, ref: "user", default: null },
  reason: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("report_user", report_user);
