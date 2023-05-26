import { Router } from "express";
import { resourceControllers } from "../../controllers";

const router = Router();

const {
  getResourceByKey,
  getCategoryResourceByKey,
  getAdvertisementResourceByKey,
  getGalleryResourceByKey,
  getNewsResourceByKey,
  getBusinessAccountGalleryResourceByKey,
  getBusinessAccountProfilePictureResourceByKey,
  getPersonalAccountGalleryResourceByKey,
  getPersonalAccountProfilePictureResourceByKey,
} = resourceControllers;

router.route("/:key").get(getResourceByKey);
router.route("/category/:key").get(getCategoryResourceByKey);
router.route("/advertisement/:key").get(getAdvertisementResourceByKey);
router.route("/gallery/:key").get(getGalleryResourceByKey);
router.route("/news/:key").get(getNewsResourceByKey);
router
  .route("/business-account-gallery/:key")
  .get(getBusinessAccountGalleryResourceByKey);
router
  .route("/business-account-profile-picture/:key")
  .get(getBusinessAccountProfilePictureResourceByKey);
router
  .route("/personal-account-gallery/:key")
  .get(getPersonalAccountGalleryResourceByKey);
router
  .route("/personal-account-profile-picture/:key")
  .get(getPersonalAccountProfilePictureResourceByKey);

export default router;
