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

module.exports = { postCreateNewSpecialty };
