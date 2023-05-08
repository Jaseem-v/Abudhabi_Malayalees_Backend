import { Router } from "express";
import { jobControllers } from "../../controllers";
import { superAdminAccess } from "../../middlewares";
const {
  getJobs,
  getJob,
  addJob,
  editJob,
  changeJobStatus,
  changeJobVisibility,
  deleteJob,
  restoreJob,
  pDeleteJob,
  deleteAllJob,
} = jobControllers;

const router = Router();

router.route("/").get(superAdminAccess, getJobs).post(addJob);
router.route("/delete/all").delete(superAdminAccess, deleteAllJob);
router.route("/change-status/:jid").patch(superAdminAccess, changeJobStatus);
router.route("/change-visibility/:jid").patch(superAdminAccess, changeJobVisibility);
router.route("/delete/:jid").delete(superAdminAccess, pDeleteJob);
router.route("/restore/:jid").put(superAdminAccess, restoreJob);
router
  .route("/:jid")
  .get(superAdminAccess, getJob)
  .patch(superAdminAccess, editJob)
  .delete(superAdminAccess, deleteJob);

export default router;
