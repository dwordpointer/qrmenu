const router = require("express").Router();
const {
  getRestaurant,
  getCategory,
  getProduct,
  addRestaurant,
  deleteRestaurant,
  deleteCategory,
  addCategory,
  addProduct,
  deleteProduct
} = require("../controllers/adminController");
const jwtauthmiddleware = require("../middleware/auth");

router.post("/addRestourant", jwtauthmiddleware, addRestaurant);
router.delete('/restourant/:id', jwtauthmiddleware, deleteRestaurant);
router.get("/restourant", jwtauthmiddleware, getRestaurant);

router.get("/category", jwtauthmiddleware, getCategory);
router.post("/addCategory", jwtauthmiddleware, addCategory);
router.delete('/category/:id', jwtauthmiddleware, deleteCategory);

router.get("/product", jwtauthmiddleware, getProduct);
router.post("/addProduct", jwtauthmiddleware, addProduct);
router.delete('/product/:id', jwtauthmiddleware, deleteProduct);


module.exports = router;
