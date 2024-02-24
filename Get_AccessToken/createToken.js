const accessToken = require("jsonwebtoken");
const secreatKey = "ThIsiStheseCreatKeyfoRNeXusNudGe";
const generateToken = async function genrating_Token(data) {
  const token = accessToken.sign(data, secreatKey);
  return token;
};

module.exports = {
  generateToken,
};
