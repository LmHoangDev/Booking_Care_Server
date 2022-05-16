import clinicService from "../services/clinicService";

let postCreateNewClinic = async (req, res) => {
  try {
    let response = await clinicService.postCreateNewClinicService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
let getAllClinic = async (req, res) => {
  try {
    let response = await clinicService.getAllClinicService();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
let getDetailClinicById = async (req, res) => {
  try {
    let response = await clinicService.getDetailClinicByIdService(
      +req.query.id
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
let deleteClinicById = async (req, res) => {
  try {
    let message = await clinicService.deleteClinicByIdService(+req.body.id);
    return res.status(200).json({ message });
  } catch (error) {
    console.log(error);
  }
};
let handleEditClinic = async (req, res) => {
  let data = req.body;
  let message = await clinicService.updateClinicService(data);

  return res.status(200).json({ message });
};
module.exports = {
  postCreateNewClinic,
  getAllClinic,
  getDetailClinicById,
  deleteClinicById,
  handleEditClinic,
};
