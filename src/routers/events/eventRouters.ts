import { Router } from "express";
import { eventControllers } from "../../controllers";
import { superAdminAccess } from "../../middlewares";
const {
  getEvents,
  getEvent,
  addEvent,
  editEvent,
  changeEventVisibility,
  deleteEvent,
  restoreEvent,
  pDeleteEvent,
  deleteAllEvent,
} = eventControllers;

const router = Router();

router.route("/").get(superAdminAccess, getEvents).post(addEvent);
router.route("/delete/all").delete(superAdminAccess, deleteAllEvent);
router.route("/change-visibility/:eid").patch(superAdminAccess, changeEventVisibility);
router.route("/delete/:eid").delete(superAdminAccess, pDeleteEvent);
router.route("/restore/:eid").put(superAdminAccess, restoreEvent);
router
  .route("/:eid")
  .get(superAdminAccess, getEvent)
  .patch(superAdminAccess, editEvent)
  .delete(superAdminAccess, deleteEvent);

export default router;
