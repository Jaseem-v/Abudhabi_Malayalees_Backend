import { Router } from "express";
import { jobControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
const {
  getJobs,
  getJobsForCustomer,
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

router.route("/").get(adminAccess, getJobs).post(adminAccess, addJob);
router.route("/customer").get(getJobsForCustomer);
router.route("/delete/all").delete(superAdminAccess, deleteAllJob);
router.route("/change-status/:jid").patch(adminAccess, changeJobStatus);
router.route("/change-visibility/:jid").patch(adminAccess, changeJobVisibility);
router.route("/delete/:jid").delete(adminAccess, pDeleteJob);
router.route("/restore/:jid").put(superAdminAccess, restoreJob);
router
  .route("/:jid")
  .get(adminAccess, getJob)
  .patch(adminAccess, editJob)
  .delete(superAdminAccess, deleteJob);

export default router;
