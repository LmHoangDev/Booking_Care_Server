import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
let router = express.Router();

let initWebRouters = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/create", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/users", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  //api
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);

  router.get("/api/allcode", userController.getAllCode);
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
  return app.use("/", router);
};

module.exports = initWebRouters;
