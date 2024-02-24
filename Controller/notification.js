const model = require("../Model/index");
const DAO = require("../DAO/queries");

const FCM = require("fcm-node");
const serverKey =
  "AAAAY9PkhyA:APA91bGtItnkD317hES-czcr52QhfiZuDevFAvSKbDsjWd3-T6m4LFITfP22IT1Vp5wyQbCQxJGWl8O1bcluMJM1GDI0e5KxAW_CY75C1QYipEBhRXgVQ7wpOmxEZily31PEybl_huOG"; //put your server key here
const fcm = new FCM(serverKey);

// reciverKey(test): "eETLqIzS8kpGuLyNfeejK2:APA91bEn1XWVUjOpQix1rxoJTdWUO_cX2-gxc_ATIwuNIy1cvCcDBS0LtyxXf-MP5oe5uxyuMMkj8dJMj0FZI6slu9kMi_H4-ML-6BVS4yYfvm7YPH_2K3_HI4PMFF-nBBP0GyDLfGZE"

let message = {
  to: "device_registration_token",
  notification: {
    title: "Title of your push notification",
    body: "Body of your push notification",
  },
};

const findreciver = async (userid) => {
  let reciver = await DAO.get_single_data(model.user, { _id: userid });
  return reciver;
};

// Function to send notification
const sendNotification = (message) => {
  fcm.send(message, function (err, response) {
    if (err) {
      console.log(err);
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};

const welcome = async (userId) => {
  try {
    let notificationData = {
      send_by: null,
      send_to: userId,
      message: "Welcome to NexusNudge",
      type: "welcome",
      title: "welcome",
    };
    let reciver = findreciver(notificationData.send_to).deviceToken;
    message = {
      to: reciver,
      notification: {
        title: notificationData.title,
        body: notificationData.message,
      },
    };
    await DAO.save_data(model.notification, notificationData);
    sendNotification(message);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const verificationStatus = async (data) => {
  try {
    let notificationData = {
      send_by: null,
      send_to: data._id,
      message: `verification ${data.verification_status} `,
      type: "verification",
      title: "welcome",
    };
    let reciver = findreciver(notificationData.send_to).deviceToken;
    message = {
      to: reciver,
      notification: {
        title: notificationData.title,
        body: notificationData.message,
      },
    };
    sendNotification(message);
    await DAO.save_data(model.notification, notificationData);
  } catch (err) {
    throw err;
  }
};

const newMatch = async (data) => {
  try {
    let notificationData = {
      send_by: data.liked_by,
      send_to: data.liked_to,
      message: "You got a new match",
      type: "match",
      title: "New match",
    };
    let reciver = findreciver(notificationData.send_to).deviceToken;
    message = {
      to: reciver,
      notification: {
        title: notificationData.title,
        body: notificationData.message,
      },
    };
    sendNotification(message);
    await DAO.save_data(model.notification, notificationData);
  } catch (err) {
    throw err;
  }
};

const profielLiked = async (data) => {
  try {
    let notificationData = {
      send_by: data.liked_by,
      send_to: data.liked_to,
      message: "You profile just got liked",
      type: "match",
      title: "Profiel Liked",
    };
    let reciver = findreciver(notificationData.send_to).deviceToken;
    message = {
      to: reciver,
      notification: {
        title: notificationData.title,
        body: notificationData.message,
      },
    };
    sendNotification(message);
    await DAO.save_data(model.notification, notificationData);
  } catch (err) {
    throw err;
  }
};

const swip_count_rest = async (userId) => {
  try {
    let notificationData = {
      send_by: null,
      send_to: userId,
      message: "Swip count refreshed",
      type: "swiplimit",
      title: "swiplimit",
    };
    let reciver = findreciver(notificationData.send_to).deviceToken;
    message = {
      to: reciver,
      notification: {
        title: notificationData.title,
        body: notificationData.message,
      },
    };
    sendNotification(message);
    await DAO.save_data(model.notification, notificationData);
  } catch (err) {
    throw err;
  }
};

const plan_expired = async (userId) => {
  try {
    let notificationData = {
      send_by: null,
      send_to: userId,
      message: "You plan is expired",
      type: "plan",
      title: "plan expired",
    };
    let reciver = findreciver(notificationData.send_to).deviceToken;
    message = {
      to: reciver,
      notification: {
        title: notificationData.title,
        body: notificationData.message,
      },
    };
    sendNotification(message);
    await DAO.save_data(model.notification, notificationData);
  } catch (err) {
    throw err;
  }
};

const message_delivered = async (data) => {
  try {
    let notificationData = {
      send_by: data.message_by,
      send_to: data.message_to,
      message: "You got a new messgae ",
      type: "message",
      title: "new message",
    };
    let reciver = findreciver(notificationData.send_to).deviceToken;
    message = {
      to: reciver,
      notification: {
        title: notificationData.title,
        body: notificationData.message,
      },
    };
    sendNotification(message);
    return await DAO.save_data(model.notification, notificationData);
  } catch (err) {
    console.log("msg err ---------- ", err);
    throw err;
  }
};

module.exports = {
  welcome,
  verificationStatus,
  newMatch,
  profielLiked,
  swip_count_rest,
  plan_expired,
  message_delivered,
};
