import { Router } from "express";
import { config } from "../../config";
import { personalAccountControllers } from "../../controllers";
import {
  superAdminAccess,
  personalAccountAccess,
  adminAccess,
} from "../../middlewares";
import { s3Upload } from "../../functions";
import { guestAccess } from "../../middlewares/authmiddleware";
const {
  getPersonalAccounts,
  getVerifiedPersonalAccounts,
  getPersonalAccount,
  getPersonalAccountProfile,
  personalAccountLogin,
  addPersonalAccount,
  sendVerificationMailPersonalAccount,
  verifyPersonalAccount,
  editPersonalAccount,
  updatePersonalAccountProfile,
  changePersonalAccountProfileImage,
  removePersonalAccountProfileImage,
  addGalleryImage,
  removeGalleryImage,
  removeAllGalleryImages,
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
const {
  AWS_S3_PERSONAL_ACCOUNT_GALLERY_RESOURCES,
  AWS_S3_PERSONAL_ACCOUNT_PROFILE_RESOURCES,
} = config.AWS_S3;

const router = Router();

router
  .route("/")
  .get(adminAccess, getPersonalAccounts)
  .post(adminAccess, addPersonalAccount);
router.route("/verified").get(guestAccess, getVerifiedPersonalAccounts);
router.route("/login").patch(personalAccountLogin);
router.route("/signup").post(addPersonalAccount);
router
  .route("/send-verification")
  .patch(guestAccess, sendVerificationMailPersonalAccount);
router.route("/verify-account").patch(verifyPersonalAccount);
router.route("/forget-password").patch(forgotPersonalAccountPassword);
router.route("/reset-password").patch(resetPersonalAccountPassword);
router.route("/profile").get(personalAccountAccess, getPersonalAccountProfile);
router
  .route("/profile")
  .patch(personalAccountAccess, updatePersonalAccountProfile);
router 
   .route("/change-profile-picture") 
   .patch(
personalAccountAccess,    s3Upload(AWS_S3_PERSONAL_ACCOUNT_PROFILE_RESOURCES, "single", "image"),    changePersonalAccountProfileImage); 

 router .route("/remove-profile-picture") 
   .delete(personalAccountAccess, removePersonalAccountProfileImage); 
router 
   .route("/add-gallery") 
   .patch( 
     personalAccountAccess,    s3Upload(AWS_S3_PERSONAL_ACCOUNT_GALLERY_RESOURCES, "single", "image"), addGalleryImage); 
router.route("/remove-all-gallerys") 
   .delete(personalAccountAccess, removeAllGalleryImages); 
router.route("/remove-gallery/:gid") 
  .delete(personalAccountAccess, removeGalleryImage); 
router
  .route("/check-username-availablility")
  .patch(checkPersonalAccountUsernameAvailability);
router
  .route("/change-password")
  .patch(personalAccountAccess, changePersonalAccountPassword);
router
  .route("/change-phone")
  .patch(personalAccountAccess, changePersonalAccountPhone);
router
  .route("/change-email")
  .patch(personalAccountAccess, changePersonalAccountEmail);
router
  .route("/change-username")
  .patch(personalAccountAccess, changePersonalAccountUsername);
router.route("/delete/all").delete(superAdminAccess, deleteAllPersonalAccount);
router
  .route("/remove-gallery/:gid")
  .delete(personalAccountAccess, removeGalleryImage);
router
  .route("/change-status/:paid")
  .patch(adminAccess, changePersonalAccountStatus);
// Admin
router
  .route("/change-profile-picture/:paid")
  .patch(
    adminAccess,
    s3Upload(AWS_S3_PERSONAL_ACCOUNT_PROFILE_RESOURCES, "single", "image"),
    changePersonalAccountProfileImage
  );
router
  .route("/remove-profile-picture/:paid")
  .delete(adminAccess, removePersonalAccountProfileImage);
router
  .route("/add-gallery/:paid")
  .patch(
    adminAccess,
   s3Upload(AWS_S3_PERSONAL_ACCOUNT_GALLERY_RESOURCES, "single", "image"),
    addGalleryImage
  );
router
  .route("/remove-all-gallerys/:paid")
  .delete(adminAccess, removeAllGalleryImages);
router
  .route("/remove-gallery/:paid:gid")
  .delete(adminAccess, removeGalleryImage);
router.route("/delete/:paid").delete(adminAccess, pDeletePersonalAccount);
router.route("/restore/:paid").put(superAdminAccess, restorePersonalAccount);
router
  .route("/:paid")
  .get(guestAccess, getPersonalAccount)
  .patch(adminAccess, editPersonalAccount)
  .delete(superAdminAccess, deletePersonalAccount);

export default router;
