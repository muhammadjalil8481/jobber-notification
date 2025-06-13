import { Request, Router, Response } from "express";
import { StatusCodes } from "http-status-codes";

const router: Router = Router();

router.get(
  "/health",
  (_: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ status: "ok" });
  }
);

export { router as healthRoutes };
