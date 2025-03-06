import { Router } from "express";
import { getAllTables } from "../controllers/adminController.js";
import { getAllCategoryAndProduct, createOrder, getOrder, deleteOrder } from "../controllers/waiterController.js";
import jwtauthmiddleware from "../middleware/waiterAuth.js";

const router = Router();

router.get("/tables", jwtauthmiddleware, getAllTables);
router.get("/getAllCategoryAndProduct", jwtauthmiddleware, getAllCategoryAndProduct);
router.post("/createOrder", jwtauthmiddleware, createOrder);
router.get("/getOrder/:tableid", jwtauthmiddleware, getOrder);
router.delete("/deleteOrder/:orderId", jwtauthmiddleware, deleteOrder);

export default router;