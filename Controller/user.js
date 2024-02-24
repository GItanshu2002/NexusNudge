const model = require("../Model/index");
const DAO = require("../DAO/queries");
const accessToken = require("../Get_AccessToken/createToken");
const moment = require("moment");
const common = require("./common");
const aggregation = require("../Aggregations/index");
const notification = require("./notification");

// tutorial screen will ony be shown when user a signup or login
const tutorial_listing = async (payload) => {
  try {
    // it will show all non deleted tutorials add by admin
    return await DAO.get_all_data(model.introduction, { isDeleted: false });
  } catch (err) {
    throw err;
  }
};

// send otp
const send_otp = async (payload) => {
  try {
    // genrate a random 5 digit number for otp
    let OTP = Math.floor(Math.random() * 90000) + 10000;
    // call the notifocation function here to send otp

    // save the user data along with otp
    let payload_data = {
      phoneNumber: payload.phoneNumber,
      countryCode: payload.countryCode,
      isDeleted: false,
      isBlocked: false,
    };
    // if allready existing then update otp
    let user = await DAO.get_one_update_one_data(
      model.user,
      payload_data,
      { otp: OTP },
      { new: true }
    );

    //  if it is a New user, registere him in the db
    if (!user) {
      payload_data.otp = OTP;
      user = await DAO.save_data(model.user, payload_data);
    }
    return user;
  } catch (err) {
    throw err;
  }
};

// User Login and SignUp
const login_signup = async (payload) => {
  try {
    // set data from payload to one veriable
    let payload_data = {
      phoneNumber: payload.phoneNumber,
      countryCode: payload.countryCode,
      isDeleted: false,
      isBlocked: false,
    };

    // find user based on the payload inputs
    let user = await DAO.get_single_data(model.user, payload_data);

    if (user.otp == payload.otp) {
      let token = await accessToken.generateToken({ _id: user._id }); // genrate access token
      let time_now = moment().valueOf(); // using moment get the time right now
      // update required keys
      let data_to_update = {
        accessToken: token,
        tokenGenerateAt: time_now,
        lastLoginTime: time_now,
        deviceType: payload.deviceType,
        deviceToken: payload.deviceToken,
        otp_verified: true,
      };
      // update the above keys in the user db
      let update_user = await DAO.update_one_data(
        model.user,
        { _id: user._id },
        data_to_update
      );
      if (!user.profileSetup) {
        return "profile setup pending"; // the user is yet to setup required fields of profile
      }
      return update_user;
    } else {
      throw "otp verification failed Invalid otp";
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// gender ID listing
const list_of_genderId = async () => {
  try {
    // admin have provided list of gender Id here is a listing on user side
    return await DAO.get_all_data(model.genderId, { isDeleted: false });
  } catch (err) {
    throw err;
  }
};

// Interests listing
const list_of_interests = async () => {
  try {
    // admin have provided list of gender Id here is a listing on user side
    return await DAO.get_all_data(model.interest_list, { isDeleted: false });
  } catch (err) {
    throw err;
  }
};

//
const list_of_university = async () => {
  try {
    // admin have provided list of university here is a listing on user side
    return await DAO.get_all_data(model.university, { isDeleted: false });
  } catch (err) {
    throw err;
  }
};

//
const list_of_religion = async () => {
  try {
    // admin have provided list of religion here is a listing on user side
    return await DAO.get_all_data(model.religion, { isDeleted: false });
  } catch (err) {
    throw err;
  }
};

// user profile setup
const setup_user_profile = async (payload, user) => {
  try {
    let user_data = {
      name: payload.name,
      dob: payload.dob,
      image: payload.image,
      gender: payload.gender,
      genderId: payload.genderId,
      interests: payload.interests,
      interestedIn: payload.interestedIn,
      email: payload.email,
      profileSetup: true,
    };
    let setup_profile = await DAO.get_one_update_one_data(
      model.user,
      {
        _id: user._id, // from authorization
        profileSetup: false,
        $or: [{ otp_verified: true }, { socialLogin: true }],
      },
      user_data,
      { new: true }
    );
    await notification.welcome(setup_profile._id);
    return setup_profile;
  } catch (err) {
    throw err;
  }
};

// edit profile
const edit_profile = async (payload, user) => {
  try {
    let update = {
      $set: {
        bio: payload.bio,
        job: payload.job,
        company: payload.company,
        university: payload.university,
        country: payload.country,
        religion: payload.religion,
        city: payload.city,
        hight: payload.hight,
        gender: payload.gender,
        genderId: payload.genderId,
        sexualOrientation: payload.sexualOrientation,
      },
      // using push add new values to the image, interests array and use each as it will be and array input
      $push: {
        image: { $each: payload.image },
        interests: { $each: payload.interests },
      },
    };

    let update_user_profile = await DAO.get_one_update_one_data(
      model.user,
      { _id: user._id },
      update,
      { new: true }
    );

    return update_user_profile;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// remove photos
const remove_photos = async (payload, user) => {
  try {
    // using $pull operation remove provied value form the image array in db
    let payload_data = {
      $pull: {
        image: payload.image,
      },
    };
    // update latest
    let removePhoto = await DAO.get_one_update_one_data(
      model.user,
      { _id: user._id },
      payload_data,
      { new: true }
    );
    return removePhoto;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// remove interests
const remove_interests = async (payload, user) => {
  try {
    // using $pull operation remove provied value form the interests array in db
    let payload_data = {
      $pull: {
        interests: payload.interests,
      },
    };
    // update latest
    let removeinterests = await DAO.get_one_update_one_data(
      model.user,
      { _id: user._id },
      payload_data,
      { new: true }
    );
    return removeinterests;
  } catch (err) {
    throw err;
  }
};

// homePage
const homePage = async (payload, user) => {
  try {
    let ageRange = {
      minAge: payload.minAge,
      maxAge: payload.maxAge,
    }; // max and min age are set in fillter

    let dobRange = await common.getDobRange(ageRange); // calling the getDobRange function from common to get dob range

    // Adjust payload.minAge and payload.maxAge based on dobRange
    payload.minAge = dobRange.minDob;
    payload.maxAge = dobRange.maxDob;

    let query = [
      await aggregation.homePage.geoNear(payload, user), // fillter users based on location cord in db
      await aggregation.homePage.matchStage(payload, user), // filter the db operation from getting the users own document
      await aggregation.homePage.lookupStage(user), // getting those who are liked or disliked by current user to filter them out later
      await aggregation.homePage.unwind_data(), // change from array to objects and keep the null values
      await aggregation.homePage.groupStage(), // selecting those values which we are showing on home screen
      await aggregation.homePage.redctStage(user), // filtering and removing those who are allready responded
      await aggregation.homePage.projectStage(), // viewing the required
      await aggregation.homePage.sort_data(), // sort from nearest to furthest
    ];
    let listing = await model.user.aggregate(query);
    return listing;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Like & dislike user
const like_dislike = async (payload, user) => {
  try {
    let is_matched; // veriable to check if it is a match or not
    // basic data from payload
    let set_data = {
      liked_by: user._id,
      liked_to: payload._id,
    };
    // check if allready responded
    let respond = await DAO.get_single_data(model.like_dislike, set_data);
    if (!respond) {
      let check_daily_swip = await DAO.get_single_data(model.user, {
        _id: user._id,
        daily_swip_count: { $gt: 0 },
      });
      if (check_daily_swip) {
        // new responce
        set_data.like_dislike = payload.like_dislike; // save user choice
        respond = await DAO.save_data(model.like_dislike, set_data);
        await DAO.update_one_data(
          model.user,
          { _id: user._id },
          { $inc: { daily_swip_count: -1 } }
        );
        // check if it is a match
        is_matched = await common.check_if_matched(respond);
        console.log(is_matched);
      } else {
        return "Daily limit reached";
      }
    }
    return { respond, is_matched };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// view matchs
const view_matchs = async (payload, user) => {
  try {
    // fetch all matchs for user
    let fetch_user_matchs = DAO.get_all_data(model.like_dislike, {
      liked_by: user._id,
      matched: true,
    });
    return fetch_user_matchs;
  } catch (err) {
    throw err;
  }
};

// profile verification
const get_verified = async (payload, user) => {
  try {
    let set_data = {
      verification_image: payload.image,
      verification_video: payload.video,
      verification_status: "pending",
    };
    // admin will verify profile
    let send_verification_request = await DAO.update_one_data(
      model.user,
      { _id: user._id },
      set_data
    );
    return send_verification_request;
  } catch (err) {
    throw err;
  }
};

// report a user
const report_user = async (payload, user) => {
  try {
    let save_data = {
      report_by: user._id,
      report_to: payload._id,
      reason: payload.reason,
    };
    // user can report another user for misbehaving and other reasons
    let save_report = await DAO.save_data(model.report, save_data);
    return save_report;
  } catch (err) {
    throw err;
  }
};

// Membership listing
const membership_listing = async (payload) => {
  try {
    return await DAO.get_all_data(model.membership, { isDeleted: false });
  } catch (err) {
    throw err;
  }
};

// chose a plan
const plane_purchase = async (payload, user) => {
  try {
    // by selecting from membership a user can avail members benifits
    let planDetails = {
      planId: payload.planId,
      userId: user._id,
      active: true,
    };
    let chosePlane = await DAO.save_data(model.selectPlan, planDetails); // saving selection
    await common.update_data(chosePlane); // assign fraturs according to to pack
    return chosePlane;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// user notification Listing
const get_notification = async (payload, user) => {
  try {
    // fetch all notification for user
    let fetch_user_notifications = DAO.get_all_data(model.notification, {
      send_to: user._id,
      isDeleted: false,
    });
    //update is_read key
    await DAO.update_all_data(
      model.notification,
      { send_to: user._id },
      { isRead: true }
    );
    return fetch_user_notifications;
  } catch (err) {
    throw err;
  }
};

// delete notification
const delete_notification = async (payload, user) => {
  try {
    let fetch_notification = await DAO.get_one_update_one_data(
      model.notification,
      { _id: payload._id },
      { isDeleted: payload.isDeleted },
      { new: true }
    );
    return fetch_notification;
  } catch (err) {
    throw err;
  }
};
// chat
const saveChat = async (payload, user) => {
  try {
    let currentTime = moment().valueOf(); // save the time of creation (to be used when handling recent msg and last msg)

    // check if the user are a match only then allow them to chat
    let is_matched = await DAO.get_single_data(model.like_dislike, {
      $and: [
        { liked_by: user._id },
        { liked_to: payload._id }, // _id of user we are sending msg to
        { matched: true },
      ],
    });
    if (is_matched) {
      let chat_data = {
        message_by: user._id,
        message_to: payload._id,
        message: payload.message,
        message_type: payload.message_type,
        media: payload.media,
        createdAt: currentTime,
      };

      // find the last msg in the recent chat with the sender ad reciver id and update it
      let find_in_resent = await DAO.get_one_update_one_data(
        model.recentChat,
        {
          $or: [
            { message_by: payload._id, message_to: user._id },
            { message_by: user._id, message_to: payload._id },
          ], // either current user would have sent the msg or he would have recived it or contition check for both
          isDeleted: false,
        },
        chat_data,
        { new: true }
      );

      if (!find_in_resent) {
        // if it is a new chat save the last msg in the recent chat along with the sender ad reciver id
        find_in_resent = await DAO.save_data(model.recentChat, chat_data);
      }

      // save every new msg in chat
      let messages = await DAO.save_data(model.chat, chat_data);

      // if the notification is sent update is delivered key for both recent and all chat
      let message_sent = await notification.message_delivered(messages);
      if (message_sent) {
        messages = await DAO.get_one_update_one_data(
          model.chat,
          { _id: messages._id },
          { is_delivered: true },
          { new: true }
        );
        await DAO.update_one_data(
          model.recentChat,
          { _id: find_in_resent._id },
          { is_delivered: true }
        );
      }
      return messages;
    } else {
      return "yet to match";
    }
  } catch (err) {
    console.log("chat err ---------- ", err);
    throw err;
  }
};

// message listing
const viewMessage = async (payload, user) => {
  try {
    let message = await DAO.get_all_data(model.chat, {
      $or: [
        { message_by: payload._id, message_to: user._id },
        { message_by: user._id, message_to: payload._id },
      ],
      message_deleted_by: { $ne: user._id }, // if the user have deleted some msg this veriable will have his id saved for that perticular msg and it will not be visible to the user
    });

    // if the reader have viewed his msg in the chat the is_read key will be updated
    if (message) {
      await DAO.update_all_data(
        model.chat,
        {
          $or: [
            { message_by: payload._id, message_to: user._id },
            { message_by: user._id, message_to: payload._id },
          ],
        },
        { is_read: true }
      );
      await DAO.update_one_data(
        model.recentChat,
        {
          $or: [
            { message_by: payload._id, message_to: user._id },
            { message_by: user._id, message_to: payload._id },
          ],
        },
        { is_read: true }
      );
    }
    return message;
  } catch (err) {
    throw err;
  }
};

// view resent
const view_recent_chat = async (payload, user) => {
  try {
    // their will be only one recent msg between 2 users the message_to and message_by id will be updated with every msg of their chat
    return await DAO.get_all_data(model.recentChat, {
      $or: [
        { message_by: payload._id, message_to: user._id },
        { message_by: user._id, message_to: payload._id },
      ], // as their can be only one recent msg user _id can be in any of message_to or message_by
      isDeleted: false,
      message_deleted_by: { $ne: user._id },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// delete whole chat (if one user wants to delete whole chat between two users)
const delete_chat = async (payload, user) => {
  try {
    // get whole chat
    let fetch_chat = await DAO.get_all_data(model.chat, {
      $or: [
        {
          message_by: { $in: [payload._id, user._id] },
          message_to: { $in: [payload._id, user._id] },
        },
      ],
    });

    if (fetch_chat && fetch_chat.length > 0) {
      // update the required keys to delete chat for that perticular user
      await DAO.update_all_data(
        model.chat,
        {
          $or: [
            {
              message_by: { $in: [payload._id, user._id] },
              message_to: { $in: [payload._id, user._id] },
            },
          ],
          isDeleted: false,
        },
        { message_deleted_by: user._id } // with this chat will not be shown to this user
      );
      await DAO.update_all_data(
        model.recentChat,
        {
          $or: [
            {
              message_by: { $in: [payload._id, user._id] },
              message_to: { $in: [payload._id, user._id] },
            },
          ],
        },
        { message_deleted_by: user._id } // with this chat will not be shown to this user even recent chat
      );
    }
    return "chat deleted";
  } catch (err) {
    throw err;
  }
};

// delete one or multiple message
const delete_message = async (payload, user) => {
  try {
    // Fetching all messages to be deleted
    const fetch_message = await DAO.get_all_data(model.chat, {
      _id: { $in: payload._id }, // Chat ID array
      isDeleted: false,
    });
    console.log(fetch_message);
    // Finding the most recent chat involving the user
    const fetch_recent = await DAO.get_single_data(model.recentChat, {
      $or: [{ message_to: user._id }, { message_by: user._id }],
      isDeleted: false,
      message_deleted_by: { $ne: user._id },
    });

    // Updating messages to mark them as deleted and record the user who deleted them
    await DAO.update_all_data(
      model.chat,
      {
        _id: { $in: payload._id }, // Chat ID array
        isDeleted: false,
      },
      {
        isDeleted: payload.isDeleted,
        message_deleted_by: user._id,
      }
    );

    // If the recent chat message was deleted, update the recent chat with the previous message content
    const recentMessage = fetch_message.find(
      (message) =>
        message.createdAt === fetch_recent.createdAt &&
        message.message === fetch_recent.message
    );

    // Check if a recent message is found
    if (recentMessage) {
      // If a recent message is found, get the previous message
      const previousMsg = await common.previousMsg(recentMessage);

      // Update the recent chat with the content of the previous message
      await DAO.update_one_data(
        model.recentChat,
        {
          $or: [
            {
              message_by: recentMessage.message_by,
              message_to: recentMessage.message_to,
            },
            {
              message_by: recentMessage.message_to,
              message_to: recentMessage.message_by,
            },
          ],
          message: recentMessage.message,
        },
        {
          message: previousMsg.message, // Update the recent message content with the content of the previous message
        }
      );
    }

    return "Message(s) deleted";
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  tutorial_listing,
  send_otp,
  login_signup,
  list_of_genderId,
  list_of_interests,
  list_of_religion,
  list_of_university,
  setup_user_profile,
  edit_profile,
  remove_photos,
  remove_interests,
  homePage,
  like_dislike,
  view_matchs,
  get_verified,
  report_user,
  membership_listing,
  plane_purchase,
  get_notification,
  delete_notification,
  saveChat,
  viewMessage,
  view_recent_chat,
  delete_chat,
  delete_message,
};

/*
// homePage (using loops for better understanding )
const homePage = async (payload, user) => {
try {
Fetch all users and responded user selections
let all_users = await DAO.get_all_data(model.user, {
  isDeleted: payload.isDeleted,
  _id: { $ne: user._id }, // Filter out the current user
});
let responded = await DAO.get_all_data(model.like_dislike, {
  userId: user._id,
});
// Extract candidateIds from responded selections
const respondedCandidateIds = responded.map(
  (selection) => selection.candidateId
);
// Remove users whose _id is in responded.CandidateIds
for (let i = 0; i < all_users.length; i++) {
  for (let j = 0; j < respondedCandidateIds.length; j++) {
    if (
      all_users[i]._id.toString() === respondedCandidateIds[j].toString()
    ) {
      // console.log("name", all_users[i].name);
      all_users.splice(i, 1);
      i--; // Adjusting the index after splicing
      break; // No need to continue checking the same user
    }
  }
}
return all_users;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
*/
