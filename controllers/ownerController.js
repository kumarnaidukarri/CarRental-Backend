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

    // Multer middleware intercepts request, Stores the file in Local disk, adds the file information to "req.file" object.  then, automatically calls next() controller function.
    const imageFile = req.file; // Access the Stored file information = { fieldName:'image', originalName:'car_1.png', destination:'uploads/', fileName:'car_1.png', path:'uploads/car_1.png', 'size':520897 }
    console.log("FILE:", req.file);
    res.json({ success: true, file: req.file });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { changeRoleToOwner, addCar };
