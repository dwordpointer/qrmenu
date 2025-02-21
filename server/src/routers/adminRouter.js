const router = require("express").Router();
const {
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
} = require("../controllers/adminController");
const jwtauthmiddleware = require("../middleware/auth");

router.get("/restourant", jwtauthmiddleware, getRestaurant);
router.post("/addRestourant", jwtauthmiddleware, addRestaurant);
router.put("/restourant/:id", jwtauthmiddleware, updateRestaurant);
router.delete("/restourant/:id", jwtauthmiddleware, deleteRestaurant);

router.get("/category", jwtauthmiddleware, getCategory);
router.post("/addCategory", jwtauthmiddleware, addCategory);
router.put("/category/:id", jwtauthmiddleware, updateCategory);
router.delete("/category/:id", jwtauthmiddleware, deleteCategory);

router.get("/product", jwtauthmiddleware, getProduct);
router.post("/addProduct", jwtauthmiddleware, addProduct);
router.put("/product/:id", jwtauthmiddleware, updateProduct);
router.delete("/product/:id", jwtauthmiddleware, deleteProduct);

module.exports = router;
