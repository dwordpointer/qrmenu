const router = require("express").Router();
const { getRestaurant } = require("../controllers/adminController");
const {
  login,
  getCategoryById,
  getProductById
} = require("../controllers/userController");


router.post("/login", login);

router.get("/restoran", getRestaurant)
router.get("/category/:id", getCategoryById)
router.get("/product/:id", getProductById)




module.exports = router;