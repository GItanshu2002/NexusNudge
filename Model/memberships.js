// plus Membership
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const membership = new schema({
  name: { type: String, default: null },
  price: { type: Number, default: 0 },
  type: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
  },
  discription: [{ type: String, default: null }],
  count_type: {
    type: String,
    enum: ["limited", "unlimited"],
    default: "limited",
  },
  daily_swip_count: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("membership", membership);
