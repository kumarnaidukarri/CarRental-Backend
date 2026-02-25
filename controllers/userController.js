/* 'controllers folder' contains different files. 
    each file is a function.
    when a route is called by Client,
    one of this controller function gets executed based on the 'client request path'.
*/

import UserModel from "../models/User.js"; // mongodb model

// 'User Controller'
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 4) {
      return res.json({ success: false, message: "Fill all the fields" });
    }

    const userExists = await UserModel.findOne({ email }); // db query
    if (userExists) {
      // user already register the account
      return res.json({ success: false, message: "User already exists !" });
    }
  } catch (error) {
    console.log(error);
  }
};
