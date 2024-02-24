const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = require("./DataBase");
const { user, admin } = require("./Router/index");
const adminLogin = require("./adminSetup");
const {
  reset_swip_count,
  update_expired_plan,
} = require("./Controller/nodecron"); // Import the scheduled functions from the controller nodecron file

// Call the functions to schedule the tasks
reset_swip_count();
update_expired_plan();

app.use("/user", user);
app.use("/admin", admin);

// Test api
// app.get("/greeting", (req, res) => {
//   try {
//     res.send("Hello World!");
//   } catch (err) {
//     res.send(err);
//   }
// });

connection.database_connection();
adminLogin.get_adminLogin();

app.listen(8000, () => {
  console.log("Server running at: http://localhost:", 8000);
});

// APP  Strecture:
// https://stackgeeks.invisionapp.com/console/share/EJC7F84ZSVX/886654056/play
