/* 'controllers folder' contains different files. 
    these files contain 'functions' that handle 'client requests' and execute business logic for different routes.
    when a route is called by Client, the corresponding controller function gets executed based on the 'client request path'.
    i.e, Client -> Route -> Controller Function -> Database -> Response

    *** MVC Architecture ***
    Routes decide which function to call.
    Controllers contain the logic.
    Models talk to the database.
*/

import bcrypt from "bcrypt"; // 'bcrypt' library for 'Hashing the Passwords'.
import jwt from "jsonwebtoken"; // 'jwt' library to 'create jwt tokens'
import UserModel from "../models/User.js"; // mongodb model

// Generate JWT Token
const generateToken = (userId) => {
  const payload = userId;
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

// 'User Controller' file

// Register User
/* a controller function that handles 'new user registration'.
   i.e, validates user input(email,password), create a new user in db, return JWT token */
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

    const token = generateToken(user._id.toString()); // jwt token
    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// Login User
/* a controller function that handles 'user login'. */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }); // check user exist in db or not.
    if (!user) {
      return res.json({ success: false, message: "User not found !!!" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password); // user password === hashed password from db
    if (!isPasswordMatch) {
      return res.json({ success: false, message: "Invalid Credentials !!!" });
    }

    const token = generateToken(user._id.toString()); // JWT token
    return res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser };
