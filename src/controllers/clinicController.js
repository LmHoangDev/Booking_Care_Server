import clinicService from "../services/clinicService";

let postCreateNewClinic = async (req, res) => {
  try {
    let response = await clinicService.postCreateNewClinicService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { postCreateNewClinic };
