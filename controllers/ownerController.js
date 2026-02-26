import UserModel from "../models/User.js"; // db user model

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

export { changeRoleToOwner };
