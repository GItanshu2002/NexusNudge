const model = require("../Model/index");
const DAO = require("../DAO/queries");
const accessToken = require("../Get_AccessToken/createToken");
const notification = require("./notification");

// login
const login = async (payload) => {
  try {
    // save the inputs required form the payload
    let set_data = {
      email: payload.email,
      password: payload.password,
    };

    // find the admin based on the inputs
    let find_admin = await DAO.get_single_data(model.admin, set_data);

    // if the admin is found then genrate an access token based of the id
    let token = await accessToken.generateToken({ _id: find_admin._id });

    // update the token and return acknowledgment
    let updateToken = await DAO.update_one_data(
      model.admin,
      { _id: find_admin._id },
      { accessToken: token, tokenGenerateAt: Date.now() }
    );
    return updateToken;
  } catch (err) {
    throw err;
  }
};

// only admin will have the permision to add a tutorial page
const tutorial = async (payload) => {
  try {
    // save the inputs required form the payload
    let set_data = {
      title: payload.title,
      image: payload.image,
      discription: payload.discription,
    };
    // create a new tutorial page using set_data
    let save_data = await DAO.save_data(model.introduction, set_data);
    return save_data;
  } catch (err) {
    throw err;
  }
};

// only admin will have the permision to edit a tutorial page
const edit_tutorial_page = async (payload) => {
  try {
    // save the inputs required form the payload
    let set_data = {
      title: payload.title,
      image: payload.image,
      discription: payload.discription,
      isDeleted: payload.isDeleted,
    };
    // using findOneandUpdate find the page using _id from payload and edit it
    let find_add_update_existing_page = await DAO.get_one_update_one_data(
      model.introduction,
      { _id: payload._id },
      set_data,
      { new: true }
    ); // will only execiute if document if found
    return find_add_update_existing_page;
  } catch (err) {
    throw err;
  }
};

// terms & conditions can not deleted only edited
const termsConditions = async (payload) => {
  try {
    // save the inputs required form the payload
    let set_data = {
      termsConditions: payload.termsConditions,
    };
    // save termsConditions using set_data
    let save_data = await DAO.save_data(model.termsConditions, set_data);
    return save_data;
  } catch (err) {
    throw err;
  }
};

// privacy & policyset can not deleted only edited
const privacyPolicy = async (payload) => {
  try {
    // save the inputs required form the payload
    let set_data = {
      privacyPolicy: payload.privacyPolicy,
    };
    // save privacyPolicy using set_data
    let save_data = await DAO.save_data(model.privacyPolicy, set_data);
    return save_data;
  } catch (err) {
    throw err;
  }
};

// add guidelines for user to upload photos
const guidelines = async (payload) => {
  try {
    // save the inputs required form the payload
    let set_data = {
      guidelines: payload.guidelines,
    };
    // save guidelines using set_data
    let save_data = await DAO.save_data(model.guidelines, set_data);
    return save_data;
  } catch (err) {
    throw err;
  }
};

// admin have to provided list of genders
const genderId = async (payload) => {
  try {
    // save the inputs required form the payload
    let set_data = {
      genderId: payload.genderId,
    };
    // save genderId using set_data
    let save_genderId = DAO.save_data(model.genderId, set_data);
    return save_genderId;
  } catch (err) {
    throw err;
  }
};

// admin have to provided list of interests for user to select from
const interests = async (payload) => {
  try {
    // save the inputs required form the payload
    let set_data = {
      interests: payload.interests,
    };
    // save interests using set_data
    let save_interests = DAO.save_data(model.interest_list, set_data);
    return save_interests;
  } catch (err) {
    throw err;
  }
};

//sexualOrientation
const sexualOrientation = async (payload) => {
  try {
    let set_data = {
      sexualOrientation: payload.sexualOrientation,
    };
    // save interests using set_data
    let save_sexualOrientation = DAO.save_data(
      model.sexualOrientation,
      set_data
    );
    return save_sexualOrientation;
  } catch (err) {
    throw err;
  }
};

// profile verification listing
const verification_listing = async () => {
  try {
    return await DAO.get_all_data(model.profileVerification, {
      verification_status: "pending",
    });
  } catch (err) {
    throw err;
  }
};

// verification approval
const verifie_user_profile = async (payload) => {
  try {
    let verifiy = await DAO.get_one_update_one_data(
      model.user,
      { _id: payload._id },
      { verification_status: payload.verifie, isVerified: true },
      { new: true }
    );
    await notification.verificationStatus(verifiy);
    return verifiy;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// reported user listing
const reported_user_listing = async (payload) => {
  try {
    return await DAO.get_all_data(model.report, {});
  } catch (err) {
    throw err;
  }
};

// block user
const block_user = async (payload) => {
  try {
    let blockUser = await DAO.get_one_update_one_data(
      model.user,
      { _id: payload._id },
      { isBlocked: payload.isBlocked },
      { new: true }
    );
    return blockUser;
  } catch (err) {
    throw err;
  }
};

// plus membership
const add_edit_membership = async (payload) => {
  try {
    let payload_data = {
      name: payload.name,
      price: payload.price,
      type: payload.type,
      discription: payload.discription,
      daily_swip_count: payload.daily_swip_count,
      count_type: payload.count_type,
    };
    let membership = await DAO.get_one_update_one_data(
      model.membership,
      { _id: payload._id }, // give membership _id
      payload_data,
      { new: true }
    );
    if (!membership) {
      membership = await DAO.save_data(model.membership, payload_data);
    }
    return membership;
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

//
const add_edit_university = async (payload) => {
  try {
    let payload_data = {
      university: payload.university,
    };
    let university = await DAO.get_one_update_one_data(
      model.university,
      { _id: payload._id }, // give university _id
      payload_data,
      { new: true }
    );
    if (!university) {
      university = await DAO.save_data(model.university, payload_data);
    }
    return university;
  } catch (err) {
    throw err;
  }
};

//
const add_edit_religion = async (payload) => {
  try {
    let payload_data = {
      religion: payload.religion,
    };
    let religion = await DAO.get_one_update_one_data(
      model.religion,
      { _id: payload._id }, // give university _id
      payload_data,
      { new: true }
    );
    if (!religion) {
      religion = await DAO.save_data(model.religion, payload_data);
    }
    return religion;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  login,
  tutorial,
  edit_tutorial_page,
  termsConditions,
  privacyPolicy,
  guidelines,
  genderId,
  interests,
  sexualOrientation,
  verification_listing,
  verifie_user_profile,
  reported_user_listing,
  block_user,
  add_edit_membership,
  membership_listing,
  add_edit_university,
  add_edit_religion,
};
