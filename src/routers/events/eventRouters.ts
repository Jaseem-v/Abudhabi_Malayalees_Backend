import { Router } from "express";
import { eventControllers } from "../../controllers";
import { adminAccess, superAdminAccess } from "../../middlewares";
const {
  getEvents,
  getEventsForCustomer,
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

router.route("/").get(adminAccess, getEvents).post(adminAccess, addEvent);
router.route("/customer").get(getEventsForCustomer);
router.route("/delete/all").delete(superAdminAccess, deleteAllEvent);
router.route("/change-visibility/:eid").patch(adminAccess, changeEventVisibility);
router.route("/delete/:eid").delete(adminAccess, pDeleteEvent);
router.route("/restore/:eid").put(superAdminAccess, restoreEvent);
router
  .route("/:eid")
  .get(adminAccess, getEvent)
  .patch(adminAccess, editEvent)
  .delete(superAdminAccess, deleteEvent);

export default router;
