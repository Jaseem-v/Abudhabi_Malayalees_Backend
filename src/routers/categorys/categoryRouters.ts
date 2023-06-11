import { Router } from "express";
import { categoryControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
import { config } from "../../config";
import { s3Upload } from "../../functions/multer";
const {
  getCategories,
  getCategorysByBusiness,
  getCategorysByJob,
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
  .get(adminAccess, getCategories)
  .post(
    adminAccess,
    s3Upload(AWS_S3_CATEGORY_RESOURCES, "single", "image"),
    addCategory
  );
router.route("/job").get(adminAccess, getCategorysByJob);
router.route("/job/customer").get(getCategorysByJob);
router.route("/business").get(adminAccess, getCategorysByBusiness);
router.route("/business/customer").get(getCategorysByBusiness);
router.route("/delete/all").delete(superAdminAccess, deleteAllCategory);
router.route("/change-status/:cid").patch(adminAccess, changeCategoryStatus);
router
  .route("/change-visibility/:cid")
  .patch(adminAccess, changeCategoryVisibility);
router.route("/delete/:cid").delete(adminAccess, pDeleteCategory);
router.route("/restore/:cid").put(superAdminAccess, restoreCategory);
router
  .route("/:cid")
  .get(adminAccess, getCategory)
  .patch(
    adminAccess,
    s3Upload(AWS_S3_CATEGORY_RESOURCES, "single", "image"),
    editCategory
  )
  .delete(superAdminAccess, deleteCategory);

export default router;
