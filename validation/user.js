const Joi = require("joi");

const locationSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});

const profile_Setup = Joi.object({
  country: Joi.string().optional(),
  city: Joi.string().optional(),
  location: locationSchema.optional(),
  name: Joi.string().required(),
  image: Joi.array().items(Joi.string()).min(2).required(),
  dob: Joi.number().required(),
  gender: Joi.string().required(),
  genderId: Joi.string().when("gender", {
    // using .when we can add condition for it to be required
    is: "other", // here condition is that the value of gender is to be other
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  interestedIn: Joi.string().required(),
  interests: Joi.array().items(Joi.string()).max(5).optional(),
  email: Joi.string()
    .email()
    .optional()
    .description("Enter your Email Address"),
});

const login = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .description("Enter your phone Number"),
  countryCode: Joi.string()
    .pattern(/^\+\d{1,3}$/)
    .required(),
  otp: Joi.number().required(),
});

const get_otp = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .description("Enter your phone Number"),
  countryCode: Joi.string()
    .pattern(/^\+\d{1,3}$/)
    .required(),
});

const edit_profile = Joi.object({
  country: Joi.string().optional(),
  city: Joi.string().optional(),
  image: Joi.array().items(Joi.string()).min(2).optional(),
  gender: Joi.string().optional(),
  genderId: Joi.string().when("gender", {
    // using .when we can add condition for it to be required
    is: "other", // here condition is that the value of gender is to be other
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  interestedIn: Joi.string().optional(),
  bio: Joi.string().optional(),
  job: Joi.string().optional(),
  company: Joi.string().optional(),
  university: Joi.string().optional(),
  hight: Joi.string().optional(),
  sexualOrientation: Joi.string().optional(),
  interests: Joi.array().items(Joi.string()).max(5).optional(),
  email: Joi.string()
    .email()
    .optional()
    .description("Enter your Email Address"),
});

const like_dislike = Joi.object({
  _id: Joi.string().required(),
  like_dislike: Joi.string().required(),
});

const verification = Joi.object({
  image: Joi.string().optional(),
  video: Joi.string().when("image", {
    // using .when we can add condition for it to be required
    is: "other", // here condition is that the value of gender is to be other
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

const planPurchase = Joi.object({
  planId: Joi.string().required(),
});

const report = Joi.object({
  _id: Joi.string().required(),
  reason: Joi.string().required(),
});

const send_msg = Joi.object({
  _id: Joi.string().required(),
  message: Joi.string().optional(),
  message_type: Joi.string().required(),
  media: Joi.string().optional(),
});

module.exports = {
  profile_Setup,
  login,
  get_otp,
  edit_profile,
  like_dislike,
  verification,
  planPurchase,
  report,
  send_msg,
};
