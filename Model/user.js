const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let user = new Schema({
  phoneNumber: { type: String, default: null },
  countryCode: { type: String, default: null },
  otp: { type: Number, default: 0 },
  otp_verified: { type: Boolean, default: false },
  country: { type: String, default: null },
  city: { type: String, default: null },
  name: { type: String, default: null },
  image: [{ type: String, default: null }],
  dob: { type: Number, default: 0 },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: null,
  },
  genderId: { type: String, default: null }, // admin will provide a list of genders
  interestedIn: {
    type: String,
    enum: ["male", "female", "everyone"],
    default: null,
  },
  interests: [{ type: Schema.ObjectId, ref: "interestList", default: null }],
  email: { type: String, default: null },
  profileSetup: { type: Boolean, default: false },
  location: {
    type: {
      type: String,
      enum: ["Point"], // Only allow 'Point' type
      default: "Point", // Default to 'Point'
    },
    coordinates: {
      type: [Number], // Array of numbers [longitude, latitude]
      default: [0, -1], // Default coordinates if needed
    },
  }, // ref: https://www.mongodb.com/docs/manual/geospatial-queries/
  verification_image: { type: String, default: null },
  verification_video: { type: String, default: null },
  verification_status: {
    type: String,
    enum: ["ready_to_begin", "pending", "verified", "rejected"],
    default: "ready_to_begin",
  },
  isVerified: { type: Boolean, default: false }, // profile verification
  bio: { type: String, default: null },
  job: { type: String, default: null },
  company: { type: String, default: null },
  religion: { type: String, default: null },
  university: { type: String, default: null },
  hight: { type: Number, default: 0 },
  sexualOrientation: { type: String, default: null },
  is_plan_active: { type: Boolean, default: false },
  current_plan: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
  },
  activePlanId: { type: Schema.ObjectId, ref: "membership", default: null },
  daily_swip_count: { type: Number, default: 0 },
  show_age: { type: Boolean, default: true },
  show_distance: { type: Boolean, default: true },
  deviceToken: { type: String, default: null },
  deviceType: { type: String, enum: ["android", "ios"], default: "android" },
  accessToken: { type: String, default: null },
  tokenGenerateAt: { type: Number, default: 0 },
  createdAt: { type: Number, default: Date.now },
  lastLoginTime: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  socialKey: { type: String, default: null },
  socialLogin: { type: Boolean, default: false },
});

// 2dsphere indexes support queries that calculate geometries on an earth-like sphere. It is necessary when comparing
user.index({ location: "2dsphere" }); // https://www.mongodb.com/docs/manual/geospatial-queries/#2dsphere
module.exports = mongoose.model("user", user);
