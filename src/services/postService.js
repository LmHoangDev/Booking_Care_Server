import db from "../models/index";
require("dotenv").config();
import _, { reject } from "lodash";

let getAllPostService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Post.findAll({
        raw: true,
        nest: true,
        where: {
          isDeleted: false,
        },
      });

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
let postCreateNewPostService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.title ||
        !data.type ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.imageBase64
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await db.Post.create({
          title: data.title,
          type: data.type,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
          image: data.imageBase64,
        });
        resolve({
          errCode: 0,
          errMessage: "Create post successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let postDeletePostService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (_.isEmpty(data)) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let id = +data.id;
        let post = await db.Post.findOne({
          where: {
            id: id,
          },
        });
        if (post) {
          await db.Post.update({ isDeleted: true }, { where: { id } });
          resolve({
            errCode: 0,
            errMessage: "Delete post successfully",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Not found post",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updatePostService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.image ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.type ||
        !data.title ||
        _.isEmpty(data)
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let id = +data.id;
        let post = await db.Post.findOne({
          where: {
            id: id,
          },
        });
        if (post) {
          await db.Post.update(
            {
              title: data.title,
              image: data.image,
              descriptionHTML: data.descriptionHTML,
              descriptionMarkdown: data.descriptionMarkdown,
              type: data.type,
            },
            { where: { id } }
          );
          resolve({
            errCode: 0,
            errMessage: "Update post successfully",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Not found post",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllPostService,
  postCreateNewPostService,
  postDeletePostService,
  updatePostService,
};
