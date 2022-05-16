import db from "../models/index";
require("dotenv").config();
import _ from "lodash";

let postCreateNewClinicService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.imageBase64
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
          image: data.imageBase64,
          isDeleted: 0,
        });
        resolve({
          errCode: 0,
          errMessage: "Create clinic successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllClinicService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll({
        raw: true,
        nest: true,
      });

      if (data && data.length > 0) {
        data = data.filter((item, index) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item.isDeleted === 0 && item;
        });

        resolve({
          errCode: 0,
          errMessage: "Ok",
          data: data,
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Ok",
        data: [],
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailClinicByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }
      let data = await db.Clinic.findOne({
        where: { id: id },
      });
      if (data) {
        let listDoctor = [];
        data.image = Buffer.from(data.image, "base64").toString("binary");
        listDoctor = await db.Doctor_infor.findAll({
          where: { clinicId: id },
          attributes: ["doctorId", "provinceId"],
        });
        data.listDoctor = listDoctor;
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let deleteClinicByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }
      let data = await db.Clinic.findOne({
        where: { id: id },
        raw: false,
      });

      if (data) {
        data.isDeleted = true;
        await data.save();
        resolve({
          errCode: 0,
          errMessage: "Delete clinic successfully",
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: "Not found Clinic",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateClinicService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.name ||
        !data.address ||
        !data.descriptionMarkdown ||
        !data.descriptionHTML
      ) {
        resolve({ errCode: 2, errMessage: "Missing required parameter" });
      } else {
        let clinic = await db.Clinic.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (clinic) {
          clinic.name = data.name;
          clinic.address = data.address;
          clinic.descriptionHTML = data.descriptionHTML;
          clinic.descriptionMarkdown = data.descriptionMarkdown;
          if (data.image) {
            clinic.image = data.image;
          }

          await clinic.save();
          // await db.clinic.save({
          //   firstName: data.firstName,
          //   lastName: data.lastName,
          //   address: data.address,
          // });
          resolve({ errCode: 0, errMessage: "Update clinic successfully" });
        } else {
          resolve({ errCode: 1, errMessage: "The clinic not found" });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  postCreateNewClinicService,
  getAllClinicService,
  getDetailClinicByIdService,
  deleteClinicByIdService,
  updateClinicService,
};
