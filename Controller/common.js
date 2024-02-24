const model = require("../Model/index");
const DAO = require("../DAO/queries");
const moment = require("moment");
const notification = require("./notification");

// Function to calculate age in years
const getDobRange = async (payload) => {
  let minAge = payload.minAge;
  let maxAge = payload.maxAge;
  const currentYear = moment().year(); // Get the current year
  const minBirthYear = currentYear - maxAge; // Calculate the birth year for the minimum age
  const maxBirthYear = currentYear - minAge; // Calculate the birth year for the maximum age
  const minDobMoment = moment([minBirthYear, 0, 1]); // Create a Date object for January 1st of the minimum birth year and get its time in milliseconds
  const maxDobMoment = moment([maxBirthYear, 11, 31, 23, 59, 59, 999]); // Create a Date object for December 31st (end of the year) of the maximum birth year and get its time in milliseconds
  const minDob = minDobMoment.valueOf();
  const maxDob = maxDobMoment.valueOf();
  return { minDob, maxDob }; // Return an object containing the minimum and maximum date of birth in milliseconds
};

// Check If Matched
const check_if_matched = async (responce) => {
  try {
    // using userId and candidateId from responce we find the responce where the candidate have also liked user
    let conditions_to_match = {
      liked_by: responce.liked_to,
      liked_to: responce.liked_by,
      like_dislike: "like",
    };
    let matched = await DAO.get_single_data(
      model.like_dislike,
      conditions_to_match
    );
    // if matched is found
    if (matched) {
      // now we check if the choice that was made by both is like
      if (matched.like_dislike === responce.like_dislike) {
        // if it was like we update the matched key in both
        await DAO.update_one_data(
          model.like_dislike,
          { _id: matched._id },
          { matched: true }
        );
        await DAO.update_one_data(
          model.like_dislike,
          { _id: responce._id },
          { matched: true }
        );
        await notification.newMatch(responce);
        return "matched";
      }
    } else {
      await notification.profielLiked(responce);
      return "profile liked";
    }
  } catch (err) {
    throw err;
  }
};

// edit user featurs based on plan
const update_data = async (data) => {
  try {
    // when user purchase a plan we will recive data
    let findplan = await DAO.get_single_data(model.membership, {
      _id: data.planId,
    }); // by comparing planId we will find the plan
    let set_data = {
      current_plan: findplan.type,
      activePlanId: findplan._id,
      is_plan_active: data.active,
      daily_swip_count: findplan.daily_swip_count,
    };
    // update all the featurs of the user according to plan
    let update_data = await DAO.get_one_update_one_data(
      model.user,
      { _id: data.userId },
      set_data,
      { new: true }
    );
    return update_data;
  } catch (err) {
    throw err;
  }
};

// get previous msg
const previousMsg = async (currentMsg) => {
  try {
    const currentCreatedAt = moment(currentMsg.createdAt);
    let get_all_msg = await DAO.get_all_data(model.chat, {
      $or: [
        {
          message_by: currentMsg.message_by,
          message_to: currentMsg.message_to,
        },
        {
          message_by: currentMsg.message_to,
          message_to: currentMsg.message_by,
        },
      ],
      isDeleted: false,
    });

    // Sort the array of messages by the difference between createdAt values
    get_all_msg.sort(
      (a, b) =>
        currentCreatedAt.diff(moment(a.createdAt)) -
        currentCreatedAt.diff(moment(b.createdAt))
    );

    // Return the first element of the sorted array (closest to currentMsg.createdAt)
    return get_all_msg[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getDobRange,
  check_if_matched,
  update_data,
  previousMsg,
};

/* 
// get age in numbers
const getAge = async (user) => {
  try {
    const dateInMillis = user.dob; //dob in milliseconds

    // Convert date in milliseconds to a Moment.js object
    const date = moment(dateInMillis);

    // Get current date as a Moment.js object
    const currentDate = moment();

    // Calculate difference in years
    const years = currentDate.diff(date, "years");
    console.log("Age in years:", years);
    return years;
  } catch (err) {
    throw err;
  }
};
*/
