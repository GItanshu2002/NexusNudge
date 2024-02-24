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
      const getuser = await DAO.get_single_data(model.user, {
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

// this will contain images and instruction added by admin, will only be shown to new login or signup
router.get("/tutorial", async (req, res) => {
  try {
    let listing = await controller.user.tutorial_listing(req.body);
    res.send(listing);
  } catch (err) {
    res.status(400).send(err);
  }
});

// this will register the new user and send them and existing users 5 digit otp
router.post("/get_otp", validation.get_otp, async (req, res) => {
  try {
    let saveOtp = await controller.user.send_otp(req.body);
    res.send(saveOtp);
  } catch (err) {
    res.status(400).send(err);
  }
});

// login after otp verifiction
router.post("/login_signup", validation.login, async (req, res) => {
  try {
    let userLogin = await controller.user.login_signup(req.body);
    res.send(userLogin);
  } catch (err) {
    res.status(400).send(err);
  }
});

// listing of genders other then male and female provided by admin
router.get("/listing_of_genderId", async (req, res) => {
  try {
    let listing = await controller.user.list_of_genderId(req.body);
    res.send(listing);
  } catch (err) {
    res.status(400).send(err);
  }
});

// listing of user intrests
router.get("/list_of_interests", async (req, res) => {
  try {
    let listing = await controller.user.list_of_interests(req.body);
    res.send(listing);
  } catch (err) {
    res.status(400).send(err);
  }
});

// user will be req to set his profile before accessing app
router.put(
  "/profileSetup",
  validation.profileSetup,
  authorization,
  async (req, res) => {
    try {
      let profileSetup = await controller.user.setup_user_profile(
        req.body,
        req.user
      );
      res.send(profileSetup);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// other relevent info can also be added after signup
router.put(
  "/editProfile",
  authorization,
  validation.edit_profile,
  async (req, res) => {
    try {
      let edit_profile = await controller.user.edit_profile(req.body, req.user);
      res.send(edit_profile);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// removePhotos
router.put("/removePhotos", authorization, async (req, res) => {
  try {
    let addPhotos = await controller.user.remove_photos(req.body, req.user);
    res.send(addPhotos);
  } catch (err) {
    res.status(400).send(err);
  }
});

// removeinterests
router.put("/removeinterests", authorization, async (req, res) => {
  try {
    let addinterests = await controller.user.remove_interests(
      req.body,
      req.user
    );
    res.send(addinterests);
  } catch (err) {
    res.status(400).send(err);
  }
});

// removeinterests
router.get("/homePage", authorization, async (req, res) => {
  try {
    let homePage = await controller.user.homePage(req.body, req.user);
    res.send(homePage);
  } catch (err) {
    res.status(400).send(err);
  }
});

//
router.post(
  "/like_dislike",
  validation.like_dislike,
  authorization,
  async (req, res) => {
    try {
      let userChoice = await controller.user.like_dislike(req.body, req.user);
      res.send(userChoice);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// view Matchs
router.get("/viewMatchs", authorization, async (req, res) => {
  try {
    let listing = await controller.user.view_matchs(req.body, req.user);
    res.send(listing);
  } catch (err) {
    res.status(400).send(err);
  }
});

//
router.post(
  "/get_verified",
  validation.verification,
  authorization,
  async (req, res) => {
    try {
      let get_verified = await controller.user.get_verified(req.body, req.user);
      res.send(get_verified);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

//
router.post("/report", validation.report, authorization, async (req, res) => {
  try {
    let report_user = await controller.user.report_user(req.body, req.user);
    res.send(report_user);
  } catch (err) {
    res.status(400).send(err);
  }
});

//
router.get("/viewNotifications", authorization, async (req, res) => {
  try {
    let report_user = await controller.user.get_notification(
      req.body,
      req.user
    );
    res.send(report_user);
  } catch (err) {
    res.status(400).send(err);
  }
});

//
router.put("/deleteNotifications", authorization, async (req, res) => {
  try {
    let report_user = await controller.user.delete_notification(
      req.body,
      req.user
    );
    res.send(report_user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Membership Listing
router.get("/membership_listing", authorization, async (req, res) => {
  try {
    let listing = await controller.user.membership_listing(req.body);
    res.send(listing);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Select Membership
router.post(
  "/selectPlane",
  validation.planPurchase,
  authorization,
  async (req, res) => {
    try {
      let plane_purchase = await controller.user.plane_purchase(
        req.body,
        req.user
      );
      res.send(plane_purchase);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// send chat
router.post(
  "/chat",
  authorization,
  validation.save_messages,
  async (req, res) => {
    try {
      let chat = await controller.user.saveChat(req.body, req.user);
      res.send(chat);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// view chat
router.get("/viewChat", authorization, async (req, res) => {
  try {
    let viewChat = await controller.user.viewMessage(req.body, req.user);
    res.send(viewChat);
  } catch (err) {
    res.status(400).send(err);
  }
});

//
router.put("/deleteChat", authorization, async (req, res) => {
  try {
    let deleteChat = await controller.user.delete_chat(req.body, req.user);
    res.send(deleteChat);
  } catch (err) {
    res.status(400).send(err);
  }
});

//
router.get("/viewRecentchat", authorization, async (req, res) => {
  try {
    let viewChat = await controller.user.view_recent_chat(req.body, req.user);
    res.send(viewChat);
  } catch (err) {
    res.status(400).send(err);
  }
});

//
router.put("/deleteMessage", authorization, async (req, res) => {
  try {
    let deleteMessage = await controller.user.delete_message(
      req.body,
      req.user
    );
    res.send(deleteMessage);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
