import UserModel from "../models/User.js"; // db user model
import CarModel from "../models/Car.js"; // db car model

// controller function
const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await UserModel.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller function
/* a controller function to 'Add Car' into DB */
const addCar = async (req, res) => {
  try {
    const { _id } = req.user; // earlier 'verifyJWT' middleware setted 'user field' in 'request object'.
    const carData = JSON.parse(req.body.carData);
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { changeRoleToOwner, addCar };
