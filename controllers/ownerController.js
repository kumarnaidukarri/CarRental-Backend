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

    // * Send Upload the Image file into "ImageKit.io" Cloud Server
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

    res.send({
      success: true,
      message: "Car Added Successfully !!!",
      data: uploadedImageResponse,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { changeRoleToOwner, addCar };
