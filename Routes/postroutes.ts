import { Router, RequestHandler } from "express";
import postController from "../Controllers/Postcontroller";

const router = Router();

// You can define a helper type if your controllers are async:
// type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// Signup route
router.post(
  "/signup",
  postController.create as RequestHandler
);

// Login route
router.get(
  "/login",
  postController.read as RequestHandler
);

// Logout route
router.put(
  "/logout",
  postController.update as RequestHandler
);

router.delete(
    "/logout",
    postController.delete as RequestHandler
  );

export default router;
