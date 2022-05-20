import db from "../models/index";
import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");
require("dotenv").config();
const salt = bcrypt.genSaltSync(10);

// let refreshTokens = [];
// let generateAccessToken = (user) => {
//   return jwt.sign(
//     {
//       id: user.id,
//       roleId: user.roleId,
//     },
//     process.env.JWT_ACCESS_KEY,
//     { expiresIn: "30s" }
//   );
// };
// let generateRefreshToken = (user) => {
//   return jwt.sign(
//     {
//       id: user.id,
//       roleId: user.roleId,
//     },
//     process.env.JWT_REFRESH_KEY,
//     { expiresIn: "365d" }
//   );
// };
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        //user already exist
        let user = await db.User.findOne({
          attributes: [
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
            "id",
          ],
          where: { email: email, isActive: 0 },
          raw: true,
        });
        if (user) {
          //compare password: dùng cách 1 hay cách 2 đều chạy đúng cả =))
          // Cách 1: dùng asynchronous (bất đồng bộ)
          let check = await bcrypt.compare(password, user.password);
          // Cách 2: dùng synchronous  (đồng bộ)
          // let check = bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK";
            // let acc = generateAccessToken(user);
            // let refresh = generateRefreshToken(user);
            // userData.accessToken = acc;
            // userData.refreshToken = refresh;
            // generateRefreshToken(user);
            // refreshTokens.push(acc);
            // resolve(function (req, res) {
            //   return res.cookie("refresherToken", refresh, {
            //     httpOnly: true,
            //     secure: false,
            //     path: "/",
            //     sameSite: "strict",
            //   });
            // });
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User not found`;
        }
      } else {
        //return error
        userData.errCode = 1;
        userData.errMessage = `Your's Email isn't exist in our system, plz try other email`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: { exclude: ["password"] },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          attributes: { exclude: ["password"] },
          where: { id: userId },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      //lưu ý, truyền vào đúng password cần hash
      // let hashPassWord = await bcrypt.hashSync("B4c0/\/", salt); => copy paste mà ko edit nè
      let hashPassWord = await bcrypt.hashSync(password, salt);

      resolve(hashPassWord);
    } catch (e) {
      reject(e);
    }
  });
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email exist
      let check = await checkUserEmail(data.email);
      if (check) {
        resolve({
          errCode: 1,
          errMessage: `Your's Email isn't exist in our system, plz try other email`,
        });
      } else {
        let hashPassWordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPassWordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.image,
          isActive: 0,
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        await db.User.destroy({
          where: { id: userId },
        });
        resolve({ errCode: 0, errMessage: `The user is deleted !` });
      } else {
        resolve({ errCode: 2, errMessage: `The user isn't exist !` });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.positionId || !data.gender || !data.roleId) {
        resolve({ errCode: 2, errMessage: "Missing required parameter" });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.positionId = data.positionId;
        user.gender = data.gender;
        user.roleId = data.roleId;
        if (data.image) {
          user.image = data.image;
        }

        await user.save();
        // await db.User.save({
        //   firstName: data.firstName,
        //   lastName: data.lastName,
        //   address: data.address,
        // });
        resolve({ errCode: 0, errMessage: "Update user successfully" });
      } else {
        resolve({ errCode: 1, errMessage: "The user not found" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      }
      let res = {};
      let allCode = await db.Allcode.findAll({
        where: { type: typeInput },
      });
      res.errCode = 0;
      res.data = allCode;
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};
let refresherToken = async (req, res) => {
  const refresherToken = req.cookies.refresherToken;
  if (!refresherToken) {
    return res.status(401).json("You're not authenticated!");
  }
  if (!refreshTokens.includes(refresherToken)) {
    return res.status(403).json("Refresh token is invalid!");
  }
  jwt.verify(refresherToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      console.log(err);
    }
    refreshTokens = refreshTokens.filter((item) => item !== refresherToken);
    //create new access_token,refreshToken
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);
    res.cookie("refresherToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({ accessToken: newAccessToken });
  });
};
let userLogout = () => {
  return new Promise(async (req, res) => {
    res.clearCookie("refresherToken");
    refreshTokens = refreshTokens.filter(
      (item) => item !== req.cookies.refresherToken
    );
    res.status(200).json("Log out successfully!");
  });
};
let changeActiveAccount = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({ errCode: 2, errMessage: "Missing required parameter" });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        let isActive = data.isActive;
        if (isActive) {
          user.isActive = true;
        } else {
          user.isActive = false;
        }

        await user.save();
        // await db.User.save({
        //   firstName: data.firstName,
        //   lastName: data.lastName,
        //   address: data.address,
        // });
        resolve({
          errCode: 0,
          errMessage: "Change active account successfully",
        });
      } else {
        resolve({ errCode: 1, errMessage: "The user not found" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let changePasswordService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({ errCode: 2, errMessage: "Missing required parameter" });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      console.log("user cpass", user);
      if (user) {
        // let isActive = data.isActive;
        let check = await bcrypt.compare(data.password, user.password);

        if (!check) {
          resolve({
            errCode: 3,
            errMessage: "Mật khẩu không chính xác!",
          });
        } else {
          let newPassword = await hashUserPassword(data.newPassword);
          user.password = newPassword;
          await user.save();
          resolve({
            errCode: 0,
            errMessage: "Thay đổi mật khẩu thành công!",
          });
        }
      } else {
        resolve({ errCode: 1, errMessage: "The user not found" });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let changeInforUserService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.gender || !data.address || !data.phoneNumber) {
        resolve({ errCode: 2, errMessage: "Missing required parameter" });
      } else {
        let user = await db.User.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (user) {
          user.address = data.address;
          user.gender = data.gender;
          user.phoneNumber = data.phoneNumber;

          await user.save();
          resolve({
            errCode: 0,
            errMessage: "Thay đổi thông tin thành công!",
          });
        } else {
          resolve({ errCode: 1, errMessage: "The user not found" });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  handleUserLogin: handleUserLogin,
  checkUserEmail: checkUserEmail,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUserData,
  getAllCodeService,
  refresherToken,
  userLogout,
  changeActiveAccount,
  changePasswordService,
  changeInforUserService,
};
// npx sequelize-cli db:migrate --to 20220308032240-create-user.js
