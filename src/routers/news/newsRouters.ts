import { Router } from "express";
import { newsControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
const {
  getNews,
  getSingleNews,
  addNews,
  editNews,
  changeNewsVisibility,
  deleteNews,
  restoreNews,
  pDeleteNews,
  deleteAllNews,
} = newsControllers;

const router = Router();

router.route("/").get(superAdminAccess, getNews).post(addNews);
router.route("/delete/all").delete(superAdminAccess, deleteAllNews);
router.route("/change-visibility/:nid").patch(superAdminAccess, changeNewsVisibility);
router.route("/delete/:nid").delete(superAdminAccess, pDeleteNews);
router.route("/restore/:nid").put(superAdminAccess, restoreNews);
router
  .route("/:nid")
  .get(superAdminAccess, getSingleNews)
  .patch(superAdminAccess, editNews)
  .delete(superAdminAccess, deleteNews);

export default router;
