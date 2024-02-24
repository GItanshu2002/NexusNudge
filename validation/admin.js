const { json } = require("body-parser");
const Joi = require("joi");

const login = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .description("Enter your Email Address"),
  password: Joi.string().required(),
});

const tutorial = Joi.object({
  title: Joi.string().required(),
  image: Joi.string().required(),
  discription: Joi.string().required(),
});

const edit_tutorial = Joi.object({
  _id: Joi.string().required(),
  title: Joi.string().required(),
  image: Joi.string().required(),
  discription: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
});

const privacyPolicy = Joi.object({
  privacyPolicy: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
});

const termsConditions = Joi.object({
  termsConditions: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
});

const genderId = Joi.object({
  genderId: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
});

const guidelines = Joi.object({
  guidelines: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
});

const interests = Joi.object({
  interests: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
});

const sexualOrientation = Joi.object({
  sexualOrientation: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
});

const profileVerification = Joi.object({
  _id: Joi.string().required(),
  verifie: Joi.string().required(),
});

const block_user = Joi.object({
  _id: Joi.string().required(),
  isBlocked: Joi.string().required(),
});

const add_memberships = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  count_type: Joi.string().required(),
  discription: Joi.array().items(Joi.string()).required(),
  price: Joi.number().required(),
  daily_swip_count: Joi.number().required(),
  isDeleted: Joi.boolean().optional(),
});

const university = Joi.object({
  _id: Joi.string().optional(),
  university: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
});

const relegion = Joi.object({
  _id: Joi.string().optional(),
  relegion: Joi.string().required(),
  isDeleted: Joi.boolean().optional(),
});

module.exports = {
  login,
  tutorial,
  edit_tutorial,
  privacyPolicy,
  termsConditions,
  genderId,
  guidelines,
  interests,
  sexualOrientation,
  profileVerification,
  block_user,
  add_memberships,
  university,
  relegion,
};
