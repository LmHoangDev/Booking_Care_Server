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

module.exports = { postCreateNewSpecialty, getListSpecialty };
