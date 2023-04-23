import { Router } from "express";
import { categoryControllers } from "../controllers";
import { adminAccess, superAdminAccess } from "../middlewares";
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

router.route("/").get(superAdminAccess, getCategories).post(addCategory);
router.route("/delete/all").delete(superAdminAccess, deleteAllCategory);
router.route("/change-status/:cid").patch(superAdminAccess, changeCategoryStatus);
router.route("/change-visibility/:cid").patch(superAdminAccess, changeCategoryVisibility);
router.route("/delete/:cid").delete(superAdminAccess, pDeleteCategory);
router.route("/restore/:cid").put(superAdminAccess, restoreCategory);
router
  .route("/:cid")
  .get(superAdminAccess, getCategory)
  .patch(superAdminAccess, editCategory)
  .delete(superAdminAccess, deleteCategory);

export default router;
