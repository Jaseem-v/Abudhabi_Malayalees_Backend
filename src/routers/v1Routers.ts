import { Router } from "express";

import adminRouters from "./adminRouters";
import categoryRouters from "./categoryRouters";
import userRouters from "./userRouters";

const router = Router();

router.use("/admin", adminRouters);
router.use("/category", categoryRouters);
router.use("/user", userRouters);

export default router;
