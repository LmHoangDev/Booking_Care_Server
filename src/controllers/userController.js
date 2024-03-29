import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  //check email exist
  //password nhap vao ko dung
  //return userInfor
  // access_token :JWT json web token

  return res.status(200).json(userData);
};
let handleGetAllUsers = async (req, res) => {
  let id = req.query.id;
  // console.log(id);
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      users: [],
    });
  }
  let users = await userService.getAllUsers(id);
  // console.log(users);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users: users,
  });
};
let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  // console.log(message);
  return res.status(200).json(message);
};
let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);

  return res.status(200).json({ message });
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};
let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let userLogout = async (req, res) => {
  await userService.userLogout();
  res.status(200).json("Logout successfully");
};
let refreshToken = async (req, res) => {
  await userService.refreshToken();
  res.status(200).json("Refresh token successfully");
};
let activeAccount = async (req, res) => {
  try {
    let response = await userService.changeActiveAccount(req.body);
    // console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};
let changePassword = async (req, res) => {
  try {
    let response = await userService.changePasswordService(req.body);
    // console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};

let changeInforUser = async (req, res) => {
  try {
    let response = await userService.changeInforUserService(req.body);
    // console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};
module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
  userLogout,
  refreshToken,
  activeAccount,
  changePassword,
  changeInforUser,
};
