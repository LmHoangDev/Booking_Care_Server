import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import postController from "../controllers/postController";
import authController from "../controllers/authController";
import middlewareController from "../controllers/middlewareController";
let router = express.Router();

let initWebRouters = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/create", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/users", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  //api/userController
  router.post("/api/login", userController.handleLogin);
  router.get(
    "/api/get-all-users",
    // middlewareController.verifyToken,
    userController.handleGetAllUsers
  );
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.post("/api/edit-user", userController.handleEditUser);
  router.delete(
    "/api/delete-user",
    // middlewareController.verifyTokenAndAdminAuth,
    userController.handleDeleteUser
  );

  router.get("/api/allcode", userController.getAllCode);

  //doctorController
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome); //api/limit-doctors-home
  router.get("/api/get-all-doctors", doctorController.getAllDoctors); //api/get-all-doctors
  router.post("/api/save-infor-doctors", doctorController.postInforDoctors); //api/save-infor

  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById
  ); //api/get-detail-
  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule); //api/bulk-create-schedule// tao lich kham
  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleDoctorByDate
  );

  router.get(
    "/api/get-extra-infor-doctor-by-id",
    doctorController.getExtraInforDoctorById
  );

  router.get(
    "/api/get-profile-doctor-by-id",
    doctorController.getProfileDoctorById
  );

  router.get(
    `/api/get-list-patient-for-doctor`,
    doctorController.getListPatientsForDoctor
  );
  router.post(`/api/send-remedy`, doctorController.postSendRemedy);

  //patientController

  router.post(
    "/api/patient-book-appointment",
    patientController.postBookAppointment
  );

  router.post(
    "/api/verify-book-appointment",
    patientController.postVerifyBookAppointment
  );

  //specialtyController
  router.post(
    "/api/create-new-specialty",
    specialtyController.postCreateNewSpecialty
  );
  router.get("/api/get-list-specialty", specialtyController.getListSpecialty);
  //get-detail-specialty-by-id-by-location
  router.get(
    "/api/get-detail-specialty-by-id-location",
    specialtyController.getDetailSpecialtyByIdLocation
  );
  router.post("/api/edit-specialty", specialtyController.handleEditSpecialty);
  router.post(
    "/api/delete-specialty-by-id",
    specialtyController.deleteSpecialtyById
  );

  //clinicController
  router.post("/api/create-new-clinic", clinicController.postCreateNewClinic);
  router.get("/api/get-all-clinic", clinicController.getAllClinic);
  router.get(
    "/api/get-details-clinic-by-id",
    clinicController.getDetailClinicById
  );
  router.post("/api/delete-clinic-by-id", clinicController.deleteClinicById);
  router.post("/api/edit-clinic", clinicController.handleEditClinic);

  //postController
  router.get("/api/get-all-post", postController.getAllPost);
  router.post("/api/create-new-post", postController.createNewPost);
  router.post("/api/delete-post-by-id", postController.deletePostById);
  router.post("/api/update-post", postController.updatePostById);

  //authController

  router.post("/api/auth/register", authController.registerUser);
  router.post("/api/refresherToken", function (req, res) {
    userController.refresherToken;
  });
  router.post(
    "/api/logout",
    middlewareController.verifyToken,
    function (req, res) {
      userController.userLogout;
    }
  );

  // vo hieu hoa tai khoan hoac mo tai khoan
  router.post("/api/auth/activeAccount", userController.activeAccount);
  // change password
  router.post("/api/auth/changePassword", userController.changePassword);

  return app.use("/", router);
};

module.exports = initWebRouters;
