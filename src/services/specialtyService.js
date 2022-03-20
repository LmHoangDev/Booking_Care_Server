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
      }
      await db.Specialty.create({
        name: data.name,
        descriptionHTML: data.descriptionHTML,
        descriptionMarkdown: data.descriptionMarkdown,
        image: data.imageBase64,
      });
      resolve({
        errCode: 0,
        errMessage: "Create new specialty successfully!!",
      });
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
        data = data.map((item, index) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
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

module.exports = { postCreateNewSpecialtyService, getListSpecialtyService };
