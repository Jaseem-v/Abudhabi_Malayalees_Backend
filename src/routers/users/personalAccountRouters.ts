import { Router } from "express";
import { personalAccountControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
const {
  getPersonalAccounts,
  getPersonalAccount,
  getPersonalAccountProfile,
  personalAccountLogin,
  addPersonalAccount,
  editPersonalAccount,
  updatePersonalAccountProfile,
  checkPersonalAccountUsernameAvailability,
  changePersonalAccountEmail,
  changePersonalAccountUsername,
  changePersonalAccountPhone,
  changePersonalAccountStatus,
  changePersonalAccountPassword,
  forgotPersonalAccountPassword,
  resetPersonalAccountPassword,
  deletePersonalAccount,
  restorePersonalAccount,
  pDeletePersonalAccount,
  deleteAllPersonalAccount,
} = personalAccountControllers;

const router = Router();

router
  .route("/")
  .get(superAdminAccess, getPersonalAccounts)
  .post(addPersonalAccount);
router.route("/login").patch(personalAccountLogin);
router.route("/forget-password").patch(forgotPersonalAccountPassword);
router.route("/reset-password").patch(resetPersonalAccountPassword);
router.route("/profile").get(adminAccess, getPersonalAccountProfile);
router.route("/profile").patch(adminAccess, updatePersonalAccountProfile);
router
  .route("/check-username-availablility")
  .patch(checkPersonalAccountUsernameAvailability);
router
  .route("/change-password")
  .patch(adminAccess, changePersonalAccountPassword);
router.route("/delete/all").delete(superAdminAccess, deleteAllPersonalAccount);
router
  .route("/change-status/:paid")
  .patch(superAdminAccess, changePersonalAccountStatus);
router.route("/change-phone").patch(adminAccess, changePersonalAccountPhone);
router.route("/change-email").patch(adminAccess, changePersonalAccountEmail);
router
  .route("/change-username")
  .patch(adminAccess, changePersonalAccountUsername);
router.route("/delete/:paid").delete(superAdminAccess, pDeletePersonalAccount);
router.route("/restore/:paid").put(superAdminAccess, restorePersonalAccount);
router
  .route("/:paid")
  .get(superAdminAccess, getPersonalAccount)
  .patch(superAdminAccess, editPersonalAccount)
  .delete(superAdminAccess, deletePersonalAccount);

export default router;
