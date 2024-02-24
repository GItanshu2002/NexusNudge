const model = require("../Model/index");
const DAO = require("../DAO/queries");
const moment = require("moment");
const cron = require("node-cron");
const notification = require("./notification");

// restore swip count
const reset_swip_count = async () => {
  try {
    const renew_at = "0 0 * * *"; // Every night at 12 AM
    cron.schedule(renew_at, async () => {
      // Get all active plans and the free plan
      const activePlans = await DAO.get_all_data(
        model.membership,
        { isDeleted: false },
        { _id: 1, daily_swip_count: 1, name: 1 }
      );
      const freePlan = activePlans.find((plan) => plan.name === "free"); // will give free benifites avilable to those whos plan has expired
      // Get all users and their active plans
      const allUsers = await DAO.get_all_data(model.user, {
        isDeleted: false,
        isBlocked: false,
      });

      for (let user of allUsers) {
        let foundPlan;
        if (user.activePlanId) {
          // Find the user's active plan
          foundPlan = activePlans.find(
            (plan) => plan._id.toString() === user.activePlanId.toString()
          );
        }

        // Determine the plan to use for resetting daily_swip_count
        const planToUpdate = foundPlan ? foundPlan : freePlan; // if plan is found then update accordingly else give free benifits avilable

        // Update the user's daily_swip_count
        let update_count = await DAO.update_all_data(
          model.user,
          { _id: user._id, isDeleted: false, isBlocked: false },
          {
            is_plan_active: !!planToUpdate, // Set to true if a plan is found
            daily_swip_count: planToUpdate.daily_swip_count,
          }
        );
        await notification.swip_count_rest(user._id);
      }
    });
  } catch (err) {
    throw err;
  }
};

// if a plan is expired update data accordingly
const update_expired_plan = async () => {
  try {
    let fetch_all_users = await DAO.get_all_data(model.selectPlan, {
      isDeleted: false,
    });
    for (let user of fetch_all_users) {
      // Schedule cron job to execute at midnight every day
      cron.schedule("0 0 * * *", async () => {
        // Code to execute when the task runs at midnight every day
        const now = new Date();
        const expirationDate = moment(user.createdAt).add(1, "months").toDate();
        if (now >= expirationDate) {
          await DAO.update_one_data(
            model.user,
            { _id: user.userId },
            { is_plan_active: false, activePlanId: null }
          );
        }
        await notification.plan_expired(user.userId);
      });
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  reset_swip_count,
  update_expired_plan,
};
