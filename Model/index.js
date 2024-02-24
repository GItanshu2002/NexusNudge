/* ******************************** admin ******************************** */

const admin = require("./admin");
const introduction = require("./introduction");
const termsConditions = require("./trems&conditions");
const privacyPolicy = require("./privacy&policy");
const guidelines = require("./guidelines");
const genderId = require("./genderid");
const interest_list = require("./list_of_interests");
const sexualOrientation = require("./sexual_orientation_list");
const membership = require("./memberships");
const religion = require("./religion");
const university = require("./university");
/* ******************************** user ******************************** */

const user = require("./user");
const like_dislike = require("./like_dislike");
const report = require("./reportUser");
const notification = require("./notification");
const selectPlan = require("./userPlan");
const chat = require("./chat");
const recentChat = require("./recentChat");

module.exports = {
  admin: admin,
  introduction: introduction,
  termsConditions: termsConditions,
  privacyPolicy: privacyPolicy,
  guidelines: guidelines,
  user: user,
  genderId: genderId,
  interest_list: interest_list,
  like_dislike: like_dislike,
  sexualOrientation: sexualOrientation,
  report: report,
  notification: notification,
  membership: membership,
  selectPlan: selectPlan,
  religion: religion,
  university: university,
  chat: chat,
  recentChat: recentChat,
};
