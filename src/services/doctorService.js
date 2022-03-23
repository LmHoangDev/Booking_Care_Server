import db from "../models/index";
require("dotenv").config();
import _ from "lodash";
import { sendEmailAttachment } from "./emailService";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHomeService = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getAllDoctorsService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let saveInfoDoctorsService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("data", inputData);
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.action ||
        !inputData.selectedPrice ||
        !inputData.selectedPayment ||
        !inputData.addressClinic ||
        !inputData.nameClinic ||
        !inputData.selectedProvince ||
        !inputData.note ||
        !inputData.selectedSpecialty
      ) {
        reject({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        //upsert to markdown
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentMarkdown: inputData.contentMarkdown,
            contentHTML: inputData.contentHTML,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkDown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkDown) {
            doctorMarkDown.contentHTML = inputData.contentHTML;
            doctorMarkDown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkDown.description = inputData.description;
            doctorMarkDown.updatedAt = new Date();
            await doctorMarkDown.save();
          }
        }

        //upsert to doctor_info=
        let doctorInfor = await db.Doctor_infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });

        if (doctorInfor) {
          //update
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.paymentId = inputData.selectedPayment;
          doctorInfor.provinceId = inputData.selectedProvince;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.nameClinic = inputData.nameClinic;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.selectedSpecialty;
          doctorInfor.clinicId = inputData.selectedClinic;

          await doctorInfor.save();
        } else {
          //create
          await db.Doctor_infor.create({
            doctorId: inputData.doctorId,
            provinceId: inputData.selectedProvince,
            priceId: inputData.selectedPrice,
            paymentId: inputData.selectedPayment,
            addressClinic: inputData.addressClinic,
            nameClinic: inputData.nameClinic,
            note: inputData.note,
            specialtyId: inputData.selectedSpecialty,
            clinicId: inputData.selectedClinic,
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save information doctor successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailDoctorByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: id },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
        if (!data) {
          data = {};
        }
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let bulkCreateScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formatDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item, index) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }

        //get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        //Compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        //create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getScheduleDoctorByDateService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!dataSchedule) dataSchedule = [];
        resolve({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getExtraInforDoctorByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id)
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      let data = await db.Doctor_infor.findOne({
        where: {
          doctorId: id,
        },
        attributes: {
          exclude: ["id", "doctorId"],
        },
        include: [
          {
            model: db.Allcode,
            as: "priceTypeData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "provinceTypeData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "paymentTypeData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: false,
        nest: true,
      });
      if (!data) data = {};
      resolve({ errCode: 0, data });
    } catch (error) {
      reject(error);
    }
  });
};

let getProfileDoctorByIdService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId)
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      let data = await db.User.findOne({
        where: {
          id: doctorId,
        },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Markdown,
            attributes: ["contentHTML", "contentMarkdown", "description"],
          },
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Doctor_infor,
            attributes: {
              exclude: ["id", "doctorId"],
            },
            include: [
              {
                model: db.Allcode,
                as: "priceTypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "provinceTypeData",
                attributes: ["valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "paymentTypeData",
                attributes: ["valueEn", "valueVi"],
              },
            ],
          },
        ],
        raw: false,
        nest: true,
      });
      if (!data) data = {};
      if (data && data.image) {
        data.image = Buffer.from(data.image, "base64").toString();
      }
      resolve({ errCode: 0, data });
    } catch (error) {
      reject(error);
    }
  });
};
let getListPatientsForDoctorService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: [
                "email",
                "firstName",
                "gender",
                "address",
                "phoneNumber",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueVi", "valueEn"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueVi", "valueEn"],
            },
          ],
          raw: false,
          nest: true,
        });
        resolve({
          errCode: 0,
          errMessage: "Ok",
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let postSendRemedyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S2",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
          await sendEmailAttachment(data);
        }
        resolve({
          errCode: 0,
          errMessage: "Confirm appointment successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getTopDoctorHomeService,
  getAllDoctorsService,
  saveInfoDoctorsService,
  getDetailDoctorByIdService,
  bulkCreateScheduleService,
  getScheduleDoctorByDateService,
  getExtraInforDoctorByIdService,
  getProfileDoctorByIdService,
  getListPatientsForDoctorService,
  postSendRemedyService,
};
// npx sequelize-cli db:migrate --to 20220308032240-create-user.js
