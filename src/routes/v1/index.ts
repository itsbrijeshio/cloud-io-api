import { Router } from "express";
import authRoute from "./auth.route";
import folderRoute from "./folder.route";
import fileRoute from "./file.route";

import { authGuard } from "../../middlewares";

const router = Router();

router.use("/auth", authRoute);
router.use("/folders", authGuard, folderRoute);
router.use("/files", authGuard, fileRoute);

export default router;
