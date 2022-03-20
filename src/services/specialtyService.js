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

module.exports = { postCreateNewSpecialtyService };
