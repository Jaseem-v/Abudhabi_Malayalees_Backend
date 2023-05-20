import { Router } from "express";

import adminRouters from "./admins/adminRouters";
import categoryRouters from "./categorys/categoryRouters";
import userRouters from "./users/userRouters";
import businessAccountRouters from "./users/businessAccountRouters";
import personalAccountRouters from "./users/personalAccountRouters";

const router = Router();

router.use("/admin", adminRouters);
router.use("/category", categoryRouters);
// router.use("/user", userRouters);
router.use("/user/business", businessAccountRouters);
router.use("/user/personal", personalAccountRouters);

export default router;