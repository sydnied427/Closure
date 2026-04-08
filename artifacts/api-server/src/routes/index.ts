import { Router, type IRouter } from "express";
import healthRouter from "./health";
import waitlistRouter from "./waitlist";
import lettersRouter from "./letters";
import closureRouter from "./closure";

const router: IRouter = Router();

router.use(healthRouter);
router.use(waitlistRouter);
router.use(lettersRouter);
router.use(closureRouter);

export default router;
