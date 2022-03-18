import doctorService from "../services/doctorService";
let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorHomeService(+limit);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let response = await doctorService.getAllDoctorsService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};
let postInforDoctors = async (req, res) => {
  try {
    let response = await doctorService.saveInfoDoctorsService(req.body);
    // console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};
let getDetailDoctorById = async (req, res) => {
  try {
    let response = await doctorService.getDetailDoctorByIdService(req.query.id);
    // console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};
let bulkCreateSchedule = async (req, res) => {
  try {
    let response = await doctorService.bulkCreateScheduleService(req.body);
    // console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};
let getScheduleDoctorByDate = async (req, res) => {
  try {
    let data = await doctorService.getScheduleDoctorByDateService(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ errCode: -1, errMessage: "Error from server ..." });
  }
};

let getExtraInforDoctorById = async (req, res) => {
  try {
    let data = await doctorService.getExtraInforDoctorByIdService(
      req.query.doctorId
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ errCode: -1, errMessage: "Error from server ..." });
  }
};

let getProfileDoctorById = async (req, res) => {
  try {
    let data = await doctorService.getProfileDoctorByIdService(
      req.query.doctorId
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ errCode: -1, errMessage: "Error from server ..." });
  }
};
module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  postInforDoctors,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
};
