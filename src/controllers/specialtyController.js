import specialtyService from "../services/specialtyService";

let postCreateNewSpecialty = async (req, res) => {
  try {
    let response = await specialtyService.postCreateNewSpecialtyService(
      req.body
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
let getListSpecialty = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = "";
  try {
    let response = await specialtyService.getListSpecialtyService(+limit);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};

let getDetailSpecialtyByIdLocation = async (req, res) => {
  try {
    let id = req.query.id;
    let location = req.query.location;
    let response = await specialtyService.getDetailSpecialtyByIdLocationService(
      +id,
      location
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server ...",
    });
  }
};
let handleEditSpecialty = async (req, res) => {
  let data = req.body;
  let message = await specialtyService.updateSpecialtyService(data);

  return res.status(200).json({ message });
};
let deleteSpecialtyById = async (req, res) => {
  try {
    let message = await specialtyService.deleteSpecialtyByIdService(
      +req.body.id
    );
    return res.status(200).json({ message });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  postCreateNewSpecialty,
  getListSpecialty,
  getDetailSpecialtyByIdLocation,
  handleEditSpecialty,
  deleteSpecialtyById,
};
