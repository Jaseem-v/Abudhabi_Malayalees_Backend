import { Router } from "express";
import { advertisementControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
import { s3Upload } from "../../functions/multer";
import { config } from "../../config";
const {
  getAdvertisements,
  getAdvertisementsByRealEstate,
  getAdvertisementsByUserCar,
  getAdvertisement,
  addAdvertisement,
  editAdvertisement,
  changeAdvertisementStatus,
  changeAdvertisementVisibility,
  deleteAdvertisement,
  restoreAdvertisement,
  pDeleteAdvertisement,
  deleteAllAdvertisement,
} = advertisementControllers;

const router = Router();

const { AWS_S3_ADZ_RESOURCES } = config.AWS_S3;

router
  .route("/")
  .get(superAdminAccess, getAdvertisements)
  .post(
    superAdminAccess,
    s3Upload(AWS_S3_ADZ_RESOURCES, "single", "image"),
    addAdvertisement
  );

router.route("/used-car").get(adminAccess, getAdvertisementsByUserCar);
router.route("/used-car/customer").get(getAdvertisementsByUserCar);
router.route("/real-estate").get(adminAccess, getAdvertisementsByRealEstate);
router.route("/real-estate/customer").get(getAdvertisementsByRealEstate);
router.route("/delete/all").delete(superAdminAccess, deleteAllAdvertisement);
router
  .route("/change-status/:aid")
  .patch(superAdminAccess, changeAdvertisementStatus);
router
  .route("/change-visibility/:aid")
  .patch(superAdminAccess, changeAdvertisementVisibility);
router.route("/delete/:aid").delete(superAdminAccess, pDeleteAdvertisement);
router.route("/restore/:aid").put(superAdminAccess, restoreAdvertisement);
router
  .route("/:aid")
  .get(superAdminAccess, getAdvertisement)
  .patch(
    superAdminAccess,
    s3Upload(AWS_S3_ADZ_RESOURCES, "single", "image"),
    editAdvertisement
  )
  .delete(superAdminAccess, deleteAdvertisement);

export default router;
