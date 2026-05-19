import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.route";

const router: Router = Router();

const modulerRoutes = [
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/users",
    route: UserRouter,
  },
];

modulerRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
