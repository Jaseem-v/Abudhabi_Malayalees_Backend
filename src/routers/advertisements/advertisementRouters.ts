import { Router } from "express";
import { advertisementControllers } from "../../controllers";
import { superAdminAccess } from "../../middlewares";
const {
  getAdvertisements,
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

router.route("/").get(superAdminAccess, getAdvertisements).post(addAdvertisement);
router.route("/delete/all").delete(superAdminAccess, deleteAllAdvertisement);
router.route("/change-status/:aid").patch(superAdminAccess, changeAdvertisementStatus);
router.route("/change-visibility/:aid").patch(superAdminAccess, changeAdvertisementVisibility);
router.route("/delete/:aid").delete(superAdminAccess, pDeleteAdvertisement);
router.route("/restore/:aid").put(superAdminAccess, restoreAdvertisement);
router
  .route("/:aid")
  .get(superAdminAccess, getAdvertisement)
  .patch(superAdminAccess, editAdvertisement)
  .delete(superAdminAccess, deleteAdvertisement);

export default router;
