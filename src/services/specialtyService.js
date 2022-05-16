import db from "../models/index";
require("dotenv").config();
import _ from "lodash";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

let postCreateNewSpecialtyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.imageBase64
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
          image: data.imageBase64,
          isDeleted: 0,
        });
        resolve({
          errCode: 0,
          errMessage: "Create new specialty successfully!!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getListSpecialtyService = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = [];
      if (!limit) {
        data = await db.Specialty.findAll({
          raw: true,
          nest: true,
        });
      } else {
        data = await db.Specialty.findAll({
          limit: limit,
          raw: true,
          nest: true,
        });
      }

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

let getDetailSpecialtyByIdLocationService = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }
      let data = await db.Specialty.findOne({
        where: { id: id },
        attributes: ["descriptionHTML", "descriptionMarkdown"],
      });
      if (data) {
        let listDoctor = [];
        if (location === "ALL") {
          listDoctor = await db.Doctor_infor.findAll({
            where: { specialtyId: id },
            attributes: ["doctorId", "provinceId"],
          });
        } else {
          listDoctor = await db.Doctor_infor.findAll({
            where: { specialtyId: id, provinceId: location },
            attributes: ["doctorId", "provinceId"],
          });
        }
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
let updateSpecialtyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.name ||
        !data.image ||
        !data.descriptionMarkdown ||
        !data.descriptionHTML
      ) {
        resolve({ errCode: 2, errMessage: "Missing required parameter" });
      } else {
        let specialty = await db.Specialty.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (specialty) {
          specialty.name = data.name;
          specialty.descriptionHTML = data.descriptionHTML;
          specialty.descriptionMarkdown = data.descriptionMarkdown;
          if (data.image) {
            specialty.image = data.image;
          }
          await specialty.save();
          resolve({ errCode: 0, errMessage: "Update specialty successfully" });
        } else {
          resolve({ errCode: 1, errMessage: "The specialty not found" });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteSpecialtyByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }
      let data = await db.Specialty.findOne({
        where: { id: id },
        raw: false,
      });

      if (data) {
        data.isDeleted = true;
        await data.save();
        resolve({
          errCode: 0,
          errMessage: "Delete specialty successfully",
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: "Not found Specialty",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  postCreateNewSpecialtyService,
  getListSpecialtyService,
  getDetailSpecialtyByIdLocationService,
  updateSpecialtyService,
  deleteSpecialtyByIdService,
};
