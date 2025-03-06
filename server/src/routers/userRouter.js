import { Router } from "express";
import { getRestaurant } from "../controllers/adminController.js";
import { login, getCategoryById, getProductById, checkLogin } from "../controllers/userController.js";

const router = Router();

router.post("/login", login);
router.post("/check", checkLogin);

router.get("/restoran", getRestaurant);
router.get("/category/:id", getCategoryById);

router.get("/product/:id", getProductById);

export default router;
