import { Request, Router, Response } from "express";
import { StatusCodes } from "http-status-codes";
// import { GatewayRequestVerification } from "./gateway-request-verification";

const router: Router = Router();

router.get(
  "/health",
  // GatewayRequestVerification,
  (_: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ status: "ok" });
  }
);

export { router as healthRoutes };
