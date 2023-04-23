import { Router } from "express";
import { userControllers } from "../controllers";
import { adminAccess, superAdminAccess } from "../middlewares";
const {
  getUsers,
  getUser,
  getUserProfile,
  userLogin,
  addUser,
  editUser,
  updateUserProfile,
  changeUserEmail,
  changeUsername,
  changeUserPhone,
  changeUserStatus,
  changeUserPassword,
  forgotUserPassword,
  resetUserPassword,
  deleteUser,
  restoreUser,
  pDeleteUser,
  deleteAllUser,
} = userControllers;

const router = Router();

router.route("/").get(superAdminAccess, getUsers).post(addUser);
router.route("/login").patch(userLogin);
router.route("/forget-password").patch(forgotUserPassword);
router.route("/reset-password").patch(resetUserPassword);
router.route("/profile").get(adminAccess, getUserProfile);
router.route("/profile").patch(adminAccess, updateUserProfile);
router.route("/change-password").patch(adminAccess, changeUserPassword);
router.route("/delete/all").delete(superAdminAccess, deleteAllUser);
router.route("/change-status/:uid").patch(superAdminAccess, changeUserStatus);
router.route("/change-phone").patch(adminAccess, changeUserPhone);
router.route("/change-email").patch(adminAccess, changeUserEmail);
router.route("/change-username").patch(adminAccess, changeUsername);
router.route("/delete/:uid").delete(superAdminAccess, pDeleteUser);
router.route("/restore/:uid").put(superAdminAccess, restoreUser);
router
  .route("/:uid")
  .get(superAdminAccess, getUser)
  .patch(superAdminAccess, editUser)
  .delete(superAdminAccess, deleteUser);

export default router;
