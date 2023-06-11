import { Router } from "express";
import { config } from "../../config";
import { businessAccountControllers } from "../../controllers";
import {
  adminAccess,
  businessAccountAccess,
  superAdminAccess,
} from "../../middlewares";
import { s3Upload } from "../../functions/multer";
import { guestAccess } from "../../middlewares/authmiddleware";
const {
  getBusinessAccounts,
  getVerifiedBusinessAccounts,
  getBusinessAccount,
  getBusinessAccountProfile,
  businessAccountLogin,
  addBusinessAccount,
  sendVerificationMailBusinessAccount,
  verifyBusinessAccount,
  editBusinessAccount,
  updateBusinessAccountProfile,
  changeBusinessAccountProfileImage,
  removeBusinessAccountProfileImage,
  addGalleryImage,
  removeGalleryImage,
  removeAllGalleryImages,
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
const {
  AWS_S3_BUSINESS_ACCOUNT_GALLERY_RESOURCES,
  AWS_S3_BUSINESS_ACCOUNT_PROFILE_RESOURCES,
} = config.AWS_S3;

const router = Router();

router
  .route("/")
  .get(adminAccess, getBusinessAccounts)
  .post(adminAccess, addBusinessAccount);
router.route("/verified").get(guestAccess, getVerifiedBusinessAccounts);
router.route("/login").patch(businessAccountLogin);
router.route("/signup").post(addBusinessAccount);
router.route("/forget-password").patch(forgotBusinessAccountPassword);
router.route("/reset-password").patch(resetBusinessAccountPassword);
router
  .route("/send-verification")
  .patch(guestAccess, sendVerificationMailBusinessAccount);
router.route("/verify-account").patch(verifyBusinessAccount);
router.route("/profile").get(businessAccountAccess, getBusinessAccountProfile);
router
  .route("/profile")
  .patch(businessAccountAccess, updateBusinessAccountProfile);
router
  .route("/change-profile-picture")
  .patch(
    businessAccountAccess,
    s3Upload(AWS_S3_BUSINESS_ACCOUNT_PROFILE_RESOURCES, "single", "image"),
    changeBusinessAccountProfileImage
  );
router
  .route("/remove-profile-picture")
  .delete(businessAccountAccess, removeBusinessAccountProfileImage);
router
  .route("/add-gallery")
  .patch(
    businessAccountAccess,
    s3Upload(AWS_S3_BUSINESS_ACCOUNT_GALLERY_RESOURCES, "single", "image"),
    addGalleryImage
  );
router
  .route("/remove-all-gallerys")
  .delete(businessAccountAccess, removeAllGalleryImages);
router
  .route("/check-username-availablility")
  .patch(checkBusinessAccountUsernameAvailability);
router
  .route("/change-password")
  .patch(businessAccountAccess, changeBusinessAccountPassword);
router.route("/delete/all").delete(superAdminAccess, deleteAllBusinessAccount);
router
  .route("/change-status/:baid")
  .patch(adminAccess, changeBusinessAccountStatus);
router
  .route("/remove-gallery/:gid")
  .delete(businessAccountAccess, removeGalleryImage);
router
  .route("/change-phone")
  .patch(businessAccountAccess, changeBusinessAccountPhone);
router
  .route("/change-email")
  .patch(businessAccountAccess, changeBusinessAccountEmail);
router
  .route("/change-username")
  .patch(businessAccountAccess, changeBusinessAccountUsername);

// Admin
router
  .route("/change-profile-picture/:baid")
  .patch(
    adminAccess,
    s3Upload(AWS_S3_BUSINESS_ACCOUNT_PROFILE_RESOURCES, "single", "image"),
    changeBusinessAccountProfileImage
  );
router
  .route("/remove-profile-picture/:baid")
  .delete(adminAccess, removeBusinessAccountProfileImage);
router
  .route("/add-gallery/:baid")
  .patch(
    adminAccess,
    s3Upload(AWS_S3_BUSINESS_ACCOUNT_GALLERY_RESOURCES, "single", "image"),
    addGalleryImage
  );
router
  .route("/remove-all-gallerys/:baid")
  .delete(adminAccess, removeAllGalleryImages);
router
  .route("/remove-gallery/:baid/:gid")
  .delete(adminAccess, removeGalleryImage);

router.route("/delete/:baid").delete(adminAccess, pDeleteBusinessAccount);
router.route("/restore/:baid").put(superAdminAccess, restoreBusinessAccount);
router
  .route("/:baid")
  .get(guestAccess, getBusinessAccount)
  .patch(adminAccess, editBusinessAccount)
  .delete(superAdminAccess, deleteBusinessAccount);

export default router;
