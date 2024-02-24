const express = require("express");
const router = express.Router();
const controller = require("../Controller/index");
const model = require("../Model/index");
const DAO = require("../DAO/queries");
const validation = require("../validation/validate");

// authorization
const authorization = async (req, res, next) => {
  try {
    const get_token = await req.headers.authorization; // get user authorization token
    if (get_token) {
      const getuser = await DAO.get_single_data(model.admin, {
        accessToken: get_token,
      });
      if (getuser) {
        req.user = getuser;
        next();
      } else {
        res.status(400).send("Unauthorize user");
      }
    } else {
      res.status(400).send("Authorization required");
    }
  } catch (err) {
    throw err;
  }
};

// admin login
router.get("/login", validation.adminlogin, async (req, res) => {
  try {
    let getLogin = await controller.admin.login(req.body);
    res.send(getLogin);
  } catch (err) {
    res.status(400).send(err);
  }
});

// add new tutorial page
router.post(
  "/tutorial",
  authorization,
  validation.tutorial,
  async (req, res) => {
    try {
      let tutorial = await controller.admin.tutorial(req.body);
      res.send(tutorial);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// edit existing tutorial page
router.put(
  "/edit_tutorial",
  authorization,
  validation.edit_tutorial,
  async (req, res) => {
    try {
      let edit_tutorial = await controller.admin.edit_tutorial_page(req.body);
      res.send(edit_tutorial);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// add privacyPolicy
router.post(
  "/privacyPolicy",
  authorization,
  validation.privacyPolicy,
  async (req, res) => {
    try {
      let privacyPolicy = await controller.admin.privacyPolicy(req.body);
      res.send(privacyPolicy);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// add termsConditions
router.post(
  "/termsConditions",
  validation.termsConditions,
  authorization,
  async (req, res) => {
    try {
      let termsConditions = await controller.admin.termsConditions(req.body);
      res.send(termsConditions);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// add guidelines for user to upload
router.post(
  "/guidelines",
  validation.guidelines,
  authorization,
  async (req, res) => {
    try {
      let guidelines = await controller.admin.guidelines(req.body);
      res.send(guidelines);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// add genderId for user to upload
router.post(
  "/genderId",
  validation.genderId,
  authorization,
  async (req, res) => {
    try {
      let genderId = await controller.admin.genderId(req.body);
      res.send(genderId);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// add interests for user to upload
router.post(
  "/interests",
  validation.interests,
  authorization,
  async (req, res) => {
    try {
      let interests = await controller.admin.interests(req.body);
      res.send(interests);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// add sexualOrientation for user to upload
router.post(
  "/sexualOrientation",
  validation.sexualOrientation,
  authorization,
  async (req, res) => {
    try {
      let sexualOrientation = await controller.admin.sexualOrientation(
        req.body
      );
      res.send(sexualOrientation);
    } catch (err) {
      res.status(400).send(err);
      s;
    }
  }
);

// profile verification listing
router.get("/profile_verification_listing", authorization, async (req, res) => {
  try {
    let listing = await controller.admin.verification_listing(req.body);
    res.send(listing);
  } catch (err) {
    res.status(400).send(err);
    s;
  }
});

// profile verification
router.post(
  "/profile_verification",
  validation.adminprofileVerification,
  authorization,
  async (req, res) => {
    try {
      let listing = await controller.admin.verifie_user_profile(req.body);
      res.send(listing);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// Reported User Listing
router.get("/reported_user_listing", authorization, async (req, res) => {
  try {
    let listing = await controller.admin.reported_user_listing(req.body);
    res.send(listing);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Reported User Listing
router.put(
  "/blockUser",
  validation.block_user,
  authorization,
  async (req, res) => {
    try {
      let blockUser = await controller.admin.block_user(req.body);
      res.send(blockUser);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// Reported User Listing
router.post(
  "/add_edit_membership",
  validation.add_memberships,
  authorization,
  async (req, res) => {
    try {
      let listing = await controller.admin.add_edit_membership(req.body);
      res.send(listing);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// Membership Listing
router.get("/membership_listing", authorization, async (req, res) => {
  try {
    let listing = await controller.admin.membership_listing(req.body);
    res.send(listing);
  } catch (err) {
    res.status(400).send(err);
  }
});

//
router.post(
  "/university",
  validation.university,
  authorization,
  async (req, res) => {
    try {
      let university = await controller.admin.add_edit_university(req.body);
      res.send(university);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

//
router.post(
  "/religion",
  validation.relegion,
  authorization,
  async (req, res) => {
    try {
      let religion = await controller.admin.add_edit_religion(req.body);
      res.send(religion);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

module.exports = router;
