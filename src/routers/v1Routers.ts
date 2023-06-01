import { Router } from "express";

import adminRouters from "./admins/adminRouters";
import categoryRouters from "./categorys/categoryRouters";
import advertisementRouters from "./advertisements/advertisementRouters";
import newsRouters from "./news/newsRouters";
import galleryRouters from "./gallerys/galleryRouters";
// import userRouters from "./users/userRouters";
import businessAccountRouters from "./users/businessAccountRouters";
import personalAccountRouters from "./users/personalAccountRouters";

const router = Router();

router.use("/admin", adminRouters);
router.use("/category", categoryRouters);
router.use("/advertisement", advertisementRouters);
router.use("/gallery", galleryRouters);
router.use("/news", newsRouters);
// router.use("/user", userRouters);
router.use("/user/business", businessAccountRouters);
router.use("/user/personal", personalAccountRouters);

export default router;