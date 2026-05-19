import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateSchema";
import { updateUserSchema } from "./user.validation";

const router: Router = Router();

// Protected routes (logged in user)
router.get("/me", authenticate, UserController.getMe);
router.patch("/me", authenticate, validateRequest(updateUserSchema), UserController.updateMe);
router.delete("/me", authenticate, UserController.deleteMe);

// Admin routes
router.get("/", authenticate, UserController.getAllUsers);
router.get("/:id", authenticate, UserController.getUserById);
router.delete("/:id", authenticate, UserController.deleteUserById);

export const UserRouter = router;
