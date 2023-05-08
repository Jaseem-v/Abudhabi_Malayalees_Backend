import { Router } from "express";
import { adminControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
const {
  getAdmins,
  getAdmin,
  getAdminProfile,
  adminLogin,
  addAdmin,
  editAdmin,
  sentLoginCredentials,
  updateAdminProfile,
  changeAdminEmail,
  changeAdminPhone,
  changeAdminStatus,
  changeAdminPassword,
  forgotAdminPassword,
  resetAdminPassword,
  deleteAdmin,
  restoreAdmin,
  pDeleteAdmin,
  deleteAllAdmin,
} = adminControllers;

const router = Router();

router.route("/").get(superAdminAccess, getAdmins).post(addAdmin);
router.route("/login").patch(adminLogin);
router.route("/forget-password").patch(forgotAdminPassword);
router.route("/reset-password").patch(resetAdminPassword);
router.route("/profile").get(adminAccess, getAdminProfile);
router.route("/profile").patch(adminAccess, updateAdminProfile);
router.route("/change-password").patch(adminAccess, changeAdminPassword);
router.route("/delete/all").delete(superAdminAccess, deleteAllAdmin);
router.route("/change-status/:aid").patch(superAdminAccess, changeAdminStatus);
router.route("/change-phone").patch(adminAccess, changeAdminPhone);
router.route("/change-email").patch(adminAccess, changeAdminEmail);
router.route("/delete/:aid").delete(superAdminAccess, pDeleteAdmin);
router.route("/restore/:aid").put(superAdminAccess, restoreAdmin);
router
  .route("/:aid")
  .get(superAdminAccess, getAdmin)
  .patch(superAdminAccess, editAdmin)
  .delete(superAdminAccess, deleteAdmin);
router
  .route("/send-login-credentials/:aid")
  .get(superAdminAccess, sentLoginCredentials);

export default router;
