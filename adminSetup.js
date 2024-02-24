const Model = require("./Model/index");
const DAO = require("./DAO/queries");

const get_adminLogin = async (req, res) => {
  const admin_avilabel = await DAO.get_single_data(Model.admin, {
    email: "admin@gmail.com",
  });
  if (admin_avilabel) {
    return admin_avilabel;
  } else {
    let admin_details = [
      {
        name: "admin",
        email: "admin@gmail.com",
        password: "1234",
        image: "image.png",
      },
      {
        name: "admin1",
        email: "admin1@gmail.com",
        password: "1234",
        image: "image.png",
      },
    ];
    const saveAdmin = await DAO.save_data(Model.admin, admin_details);
    return saveAdmin;
  }
};

module.exports = {
  get_adminLogin,
};
