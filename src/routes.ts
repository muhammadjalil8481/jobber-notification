import { Request, Router, Response } from "express";
import { StatusCodes } from "http-status-codes";

const router: Router = Router();

router.get("/notification-health", (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("Notification Service is up and running");
});


export {router as healthRoutes}