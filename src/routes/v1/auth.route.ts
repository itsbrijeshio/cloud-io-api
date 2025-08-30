import { Router } from "express";
import { UserController } from "../../controllers";
import { authGuard, validateRequest } from "../../middlewares";
import { loginSchema, registerSchema, updateSchema } from "../../schema/user";
import { uploadFile } from "../../config";

const userController = new UserController();

const router = Router();

const valid = validateRequest;

router.post("/register", valid(registerSchema), userController.handleRegister);
router.post("/login", valid(loginSchema), userController.handleLogin);
router.get("/user", authGuard, userController.handleGetUser);
router.put(
  "/user",
  authGuard,
  valid(updateSchema),
  userController.handleUpdateUser
);
router.delete("/user", authGuard, userController.handleDeleteUser);
router.post("/logout", authGuard, userController.handleLogout);
router.put(
  "/avatar",
  authGuard,
  uploadFile.single("avatar"),
  userController.handleUpdateAvatar
);

export default router;
