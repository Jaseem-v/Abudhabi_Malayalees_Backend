import { Router } from "express";
import { galleryControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
import { s3Upload } from "../../functions/multer";
import { config } from "../../config";
const {
  getGallerys,
  getGallery,
  addGallery,
  editGallery,
  changeGalleryVisibility,
  deleteGallery,
  restoreGallery,
  pDeleteGallery,
  deleteAllGallery,
} = galleryControllers;

const router = Router();

const { AWS_S3_GALLERY_RESOURCES } = config.AWS_S3;

router
  .route("/")
  .get(superAdminAccess, getGallerys)
  .post(
    superAdminAccess,
    s3Upload(AWS_S3_GALLERY_RESOURCES, "single", "image"),
    addGallery
  );
router.route("/delete/all").delete(superAdminAccess, deleteAllGallery);
router
  .route("/change-visibility/:cid")
  .patch(superAdminAccess, changeGalleryVisibility);
router.route("/delete/:cid").delete(superAdminAccess, pDeleteGallery);
router.route("/restore/:cid").put(superAdminAccess, restoreGallery);
router
  .route("/:cid")
  .get(superAdminAccess, getGallery)
  .patch(
    superAdminAccess,
    s3Upload(AWS_S3_GALLERY_RESOURCES, "single", "image"),
    editGallery
  )
  .delete(superAdminAccess, deleteGallery);

export default router;
