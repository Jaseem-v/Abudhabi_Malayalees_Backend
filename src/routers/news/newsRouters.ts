import { Router } from "express";
import { newsControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
import { config } from "../../config";
import { s3Upload } from "../../functions/multer";
const {
  getNews,
  getNewsForCustomer,
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

const {AWS_S3_NEWS_RESOURCES} = config.AWS_S3;

router
  .route("/")
  .get(adminAccess, getNews)
  .post(
    adminAccess,
    s3Upload(AWS_S3_NEWS_RESOURCES, "single", "image"),
    addNews
  );
router.route("/delete/all").delete(superAdminAccess, deleteAllNews);
router.route("/customer").get(getNewsForCustomer);
router
  .route("/change-visibility/:nid")
  .patch(adminAccess, changeNewsVisibility);
router.route("/delete/:nid").delete(adminAccess, pDeleteNews);
router.route("/restore/:nid").put(superAdminAccess, restoreNews);
router
  .route("/:nid")
  .get(adminAccess, getSingleNews)
  .patch(
    adminAccess,
    s3Upload(AWS_S3_NEWS_RESOURCES, "single", "image"),
    editNews
  )
  .delete(superAdminAccess, deleteNews);

export default router;
