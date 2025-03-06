import { Router } from "express";
import {
  getRestaurant,
  getCategory,
  getProduct,
  addRestaurant,
  updateRestaurant,
  updateCategory,
  updateProduct,
  deleteRestaurant,
  deleteCategory,
  addCategory,
  addProduct,
  deleteProduct,
  enableCategory,
  enableRestaurant,
  enableProduct,
  getAllWaiters,
  postAddWaiters,
  deleteWaiters,
  getAllTables,
  postAddTables,
  deleteTables,
} from "../controllers/adminController.js";
import jwtauthmiddleware from "../middleware/auth.js";

const router = Router();

router.get("/restourant", jwtauthmiddleware, getRestaurant);
router.post("/addRestourant", jwtauthmiddleware, addRestaurant);
router.put("/restourant/:id", jwtauthmiddleware, updateRestaurant);
router.delete("/restourant/:id", jwtauthmiddleware, deleteRestaurant);
router.put("/restourantEnable/:id", jwtauthmiddleware, enableRestaurant);

router.get("/category", jwtauthmiddleware, getCategory);
router.post("/addCategory", jwtauthmiddleware, addCategory);
router.put("/category/:id", jwtauthmiddleware, updateCategory);
router.delete("/category/:id", jwtauthmiddleware, deleteCategory);
router.put("/categoryEnable/:id", jwtauthmiddleware, enableCategory);

router.get("/product", jwtauthmiddleware, getProduct);
router.post("/addProduct", jwtauthmiddleware, addProduct);
router.put("/product/:id", jwtauthmiddleware, updateProduct);
router.delete("/product/:id", jwtauthmiddleware, deleteProduct);
router.put("/productEnable/:id", jwtauthmiddleware, enableProduct);

router.get("/waiters", jwtauthmiddleware, getAllWaiters);
router.post("/addWaiters", jwtauthmiddleware, postAddWaiters);
router.delete("/waiters/:id", jwtauthmiddleware, deleteWaiters);

router.get("/tables", jwtauthmiddleware, getAllTables);
router.post("/addTables", jwtauthmiddleware, postAddTables);
router.delete("/tables/:id", jwtauthmiddleware, deleteTables);

export default router;