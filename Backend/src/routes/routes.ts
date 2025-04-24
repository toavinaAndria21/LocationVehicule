import { Router } from "express";
import locationRouter from "./locationRoute";

const router = Router();

router.use("/location", locationRouter);


export default router;