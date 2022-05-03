import authService from "../services/authService";
import bcrypt from "bcrypt";
import db from "../models";
let registerUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    await db.User.create({
      email: req.body.email,
      password: hashed,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      gender: req.body.gender,
      image: req.body.image,
      phoneNumber: req.body.phoneNumber,
      roleId: req.body.roleId,
    });
    res.status(200).json("User register successfully!");
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = {
  registerUser,
};
