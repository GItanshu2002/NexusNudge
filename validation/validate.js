const user = require("./user");
const admin = require("./admin");

/* ************************************  user  ************************************ */

const uservalidateRequest = (schema) => async (req, res, next) => {
  try {
    const { error } = await schema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Validation for user
const profileSetup = uservalidateRequest(user.profile_Setup);
const edit_profile = uservalidateRequest(user.edit_profile);
const get_otp = uservalidateRequest(user.get_otp);
const like_dislike = uservalidateRequest(user.like_dislike);
const login = uservalidateRequest(user.login);
const planPurchase = uservalidateRequest(user.planPurchase);
const report = uservalidateRequest(user.report);
const verification = uservalidateRequest(user.verification);
const save_messages = uservalidateRequest(user.send_msg);

/* ************************************  admin  ************************************ */

const adminvalidateRequest = (schema) => async (req, res, next) => {
  try {
    const { error } = await schema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Validation for admin
const add_memberships = adminvalidateRequest(admin.add_memberships);
const block_user = adminvalidateRequest(admin.block_user);
const edit_tutorial = adminvalidateRequest(admin.edit_tutorial);
const genderId = adminvalidateRequest(admin.genderId);
const guidelines = adminvalidateRequest(admin.guidelines);
const interests = adminvalidateRequest(admin.interests);
const adminlogin = adminvalidateRequest(admin.login);
const privacyPolicy = adminvalidateRequest(admin.privacyPolicy);
const adminprofileVerification = adminvalidateRequest(
  admin.profileVerification
);
const relegion = adminvalidateRequest(admin.relegion);
const sexualOrientation = adminvalidateRequest(admin.sexualOrientation);
const termsConditions = adminvalidateRequest(admin.termsConditions);
const tutorial = adminvalidateRequest(admin.tutorial);
const university = adminvalidateRequest(admin.university);

module.exports = {
  // user
  profileSetup,
  edit_profile,
  get_otp,
  like_dislike,
  login,
  planPurchase,
  report,
  verification,
  save_messages,

  // admin
  tutorial,
  university,
  add_memberships,
  block_user,
  edit_tutorial,
  genderId,
  guidelines,
  interests,
  adminlogin,
  privacyPolicy,
  adminprofileVerification,
  relegion,
  sexualOrientation,
  termsConditions,
};
