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
module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  postInforDoctors,
  getDetailDoctorById,
};
