import UserModel from "../models/User.js"; // db user model
import CarModel from "../models/Car.js"; // db car model

import { toFile } from "@imagekit/nodejs"; // 'Imagekit SDK' official library
import imagekitClient from "../configs/imageKit.js"; // 'Imagekit my module' to upload file to the 'ImageKit Cloud Server'.

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

    // Store the upload file in LocalDisk of server (or) RAM Buffer Memory.
    // Multer middleware intercepts request, Stores the file in Local disk (or) RAM buffer memory, adds the file information to "req.file" object.  then, automatically calls next() controller function.
    /* local disk memory - {fieldName:'image', originalName:'car_1.png', destination:'uploads/', fileName:'car_1.png', path:'uploads/car_1.png', 'size':520897}
       ram buffer memory - {fieldname:'image',originalname: 'car_3.png', buffer:<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 0>, size:192897} 
    */
    const imageFileInfo = req.file; // Access the Stored file information
    // console.log("FILE:", imageFileInfo);

    // * 1) Send Upload the Image file from BackendServer into "ImageKit.io" Cloud Server
    /* Convert 'Buffer' into proper 'File Object'.   
       then parameters,  file:"uploading_file_object", fileName:"uploading_file_name", folder:"optional folder_name in Imagekit cloudserver"  */
    const fileObject = await toFile(
      imageFileInfo.buffer,
      imageFileInfo.originalname,
    );
    const uploadedImageResponse = await imagekitClient.files.upload({
      file: fileObject,
      fileName: imageFileInfo.originalname,
      folder: "cars",
    });
    console.log(
      uploadedImageResponse,
    ); /* {fileId:'69a2', name:'car1_uTdn.png', size:950862, filePath:'/cars/car1...', url:'https://ik...', fileType:'image', height:853, width:1280} */

    // * 2) Save the 'New Car' in Database.
    const imageCdnUrl = uploadedImageResponse.url;
    const response = await CarModel.create({
      ...carData,
      owner: _id,
      image: imageCdnUrl,
    }); // create a new car document

    res.send({
      success: true,
      message: "Car Added Successfully !!!",
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller function - Get "List of Owner Cars"
const getOwnerCars = async (req, res) => {
  try {
    const userId = req.user._id;
    const ownerCars = await CarModel.find({ owner: userId }); // Find Query
    res.json({ success: true, cars: ownerCars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller function - API to Toggle the "Car Availability"
const toggleCarAvailability = async (req, res) => {
  try {
    const userId = req.user._id;
    const { carId } = req.body;

    const car = await CarModel.findById(carId); // Find Query

    // Checking - is Car belongs to the login User
    if (car.owner.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Update it in DB
    car.isAvailable = !car.isAvailable; // only updates in Nodejs Memory(RAM)
    await car.save(); // detects the change in object and updates the document in Database

    res.json({
      success: true,
      message: "Availability Toggled Successfully !!!",
      car,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// controller function - API to "Delete a Car"
const deleteCar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { carId } = req.body;

    const car = await CarModel.findById(carId); // Find Query

    // Checking - is Car belongs to the login User
    if (car.owner.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Update it in Database
    /* Don't Delete the Car Document. 
       because, Someone may already booked this car and showed in UI.  * Deleting it - breaksUI, reports break, past history breaks. 
       so, keep the car record, mark it as inactive, prevent new bookings.
    */
    car.owner = null;
    car.isAvailable = false; // only updates in Nodejs Memory(RAM)
    await car.save(); // detects the change in object and updates the document in Database

    res.json({
      success: true,
      message: "Car Removed Successfully !!!",
      car,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeRoleToOwner,
  addCar,
  getOwnerCars,
  toggleCarAvailability,
  deleteCar,
};
