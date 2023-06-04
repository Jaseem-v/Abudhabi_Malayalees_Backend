import { Router } from "express";
import { eventControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
import { s3Upload } from "../../functions";
import { config } from "../../config";
const {
  getEvents,
  getEventsForCustomer,
  getEvent,
  addEvent,
  editEvent,
  changeEventVisibility,
  removeEventImage,
  deleteEvent,
  restoreEvent,
  pDeleteEvent,
  deleteAllEvent,
} = eventControllers;

const router = Router();
const { AWS_S3_EVENT_RESOURCES } = config.AWS_S3;

router
  .route("/")
  .get(adminAccess, getEvents)
  .post(
    adminAccess,
    s3Upload(AWS_S3_EVENT_RESOURCES, "single", "image"),
    addEvent
  );
router.route("/customer").get(getEventsForCustomer);
router.route("/delete/all").delete(superAdminAccess, deleteAllEvent);
router
  .route("/change-visibility/:eid")
  .patch(adminAccess, changeEventVisibility);
router.route("/remove-image/:eid").delete(adminAccess, removeEventImage);
router.route("/delete/:eid").delete(adminAccess, pDeleteEvent);
router.route("/restore/:eid").put(superAdminAccess, restoreEvent);
router
  .route("/:eid")
  .get(adminAccess, getEvent)
  .patch(
    adminAccess,
    s3Upload(AWS_S3_EVENT_RESOURCES, "single", "image"),
    editEvent
  )
  .delete(superAdminAccess, deleteEvent);

export default router;
