import { Router } from "express";
import { categoryControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
import { config } from "../../config";
import { s3Upload } from "../../functions/multer";
const {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  changeCategoryStatus,
  changeCategoryVisibility,
  deleteCategory,
  restoreCategory,
  pDeleteCategory,
  deleteAllCategory,
} = categoryControllers;

const router = Router();

const { AWS_S3_CATEGORY_RESOURCES } = config.AWS_S3;

router
  .route("/")
  .get(superAdminAccess, getCategories)
  .post(
    superAdminAccess,
    s3Upload(AWS_S3_CATEGORY_RESOURCES, "single", "image"),
    addCategory
  );
router.route("/delete/all").delete(superAdminAccess, deleteAllCategory);
router
  .route("/change-status/:cid")
  .patch(superAdminAccess, changeCategoryStatus);
router
  .route("/change-visibility/:cid")
  .patch(superAdminAccess, changeCategoryVisibility);
router.route("/delete/:cid").delete(superAdminAccess, pDeleteCategory);
router.route("/restore/:cid").put(superAdminAccess, restoreCategory);
router
  .route("/:cid")
  .get(superAdminAccess, getCategory)
  .patch(
    superAdminAccess,
    s3Upload(AWS_S3_CATEGORY_RESOURCES, "single", "image"),
    editCategory
  )
  .delete(superAdminAccess, deleteCategory);

export default router;
