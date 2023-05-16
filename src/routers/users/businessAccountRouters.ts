import { Router } from "express";
import { businessAccountControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
const {
  getBusinessAccounts,
  getBusinessAccount,
  getBusinessAccountProfile,
  businessAccountLogin,
  addBusinessAccount,
  editBusinessAccount,
  updateBusinessAccountProfile,
  checkBusinessAccountUsernameAvailability,
  changeBusinessAccountEmail,
  changeBusinessAccountUsername,
  changeBusinessAccountPhone,
  changeBusinessAccountStatus,
  changeBusinessAccountPassword,
  forgotBusinessAccountPassword,
  resetBusinessAccountPassword,
  deleteBusinessAccount,
  restoreBusinessAccount,
  pDeleteBusinessAccount,
  deleteAllBusinessAccount,
} = businessAccountControllers;

const router = Router();

router
  .route("/")
  .get(superAdminAccess, getBusinessAccounts)
  .post(superAdminAccess, addBusinessAccount);
router.route("/login").patch(businessAccountLogin);
router.route("/signup").post(addBusinessAccount);
router.route("/forget-password").patch(forgotBusinessAccountPassword);
router.route("/reset-password").patch(resetBusinessAccountPassword);
router.route("/profile").get(adminAccess, getBusinessAccountProfile);
router.route("/profile").patch(adminAccess, updateBusinessAccountProfile);
router
  .route("/check-username-availablility")
  .patch(checkBusinessAccountUsernameAvailability);
router
  .route("/change-password")
  .patch(adminAccess, changeBusinessAccountPassword);
router.route("/delete/all").delete(superAdminAccess, deleteAllBusinessAccount);
router
  .route("/change-status/:baid")
  .patch(superAdminAccess, changeBusinessAccountStatus);
router.route("/change-phone").patch(adminAccess, changeBusinessAccountPhone);
router.route("/change-email").patch(adminAccess, changeBusinessAccountEmail);
router
  .route("/change-username")
  .patch(adminAccess, changeBusinessAccountUsername);
router.route("/delete/:baid").delete(superAdminAccess, pDeleteBusinessAccount);
router.route("/restore/:baid").put(superAdminAccess, restoreBusinessAccount);
router
  .route("/:baid")
  .get(superAdminAccess, getBusinessAccount)
  .patch(superAdminAccess, editBusinessAccount)
  .delete(superAdminAccess, deleteBusinessAccount);

export default router;
