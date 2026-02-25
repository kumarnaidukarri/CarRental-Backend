/* 'controllers folder' contains different files. 
    each file is a function.
    when a route is called by Client,
    one of this controller function gets executed based on the 'client request path'.
*/

import bcrypt from "bcrypt"; // 'bcrypt' library for 'Hashing the Passwords'.
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

    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the Password. method: bcrypt.hash(password,saltRounds)
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    }); // Creates a new user data and stores into Database.
  } catch (error) {
    console.log(error);
  }
};

export { registerUser };
