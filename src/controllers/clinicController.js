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

module.exports = { postCreateNewClinic, getAllClinic, getDetailClinicById };
