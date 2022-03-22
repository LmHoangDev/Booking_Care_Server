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
      }
      await db.Clinic.create({
        name: data.name,
        address: data.address,
        descriptionHTML: data.descriptionHTML,
        descriptionMarkdown: data.descriptionMarkdown,
        image: data.imageBase64,
      });
      resolve({
        errCode: 0,
        errMessage: "Create clinic successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { postCreateNewClinicService };
