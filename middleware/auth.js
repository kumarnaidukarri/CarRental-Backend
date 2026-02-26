/* Middleware functions -
   Middleware is a function which gets executed before the 'controller function'. when we hit the 'API routes'.
 */

import jwt from "jsonwebtoken";
import UserModel from "../models/User.js"; // db user model

/* Middleware check for 'JWT token' in 'Request Header'. 
   it decodes the 'User Data' from the Token. then, adds 'user data' into the 'Request Object'.
   calls the next middleware.
*/
const protectRoute_VerifyJwtToken = async (req, res, next) => {
  const token = req.headers.authorization; // accessing token from 'request headers'.
  if (!token) {
    // token is not present
    return res.json({ success: false, message: "not authorized" });
  }

  try {
    const userId = jwt.decode(token, process.env.JWT_SECRET_KEY); // decode(token, secret_key) returns decoded userdata(user_id).
    if (!userId) {
      return res.json({ success: false, message: "not authorized" });
    }

    const userData = await UserModel.findById(userId).select("-password"); // DB Query - find user and returns user object without password field
    req.user = userData; // adds 'user property' in Request object.

    next(); // calls the next middleware function. i.e, controller function
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: "not authorized" });
  }
};

export { protectRoute_VerifyJwtToken };
