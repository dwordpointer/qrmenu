const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const bcrypt = require("bcrypt");

module.exports = async () => {
  try {
    // Kullanıcı ekleme
    await User.bulkCreate([
      {
        name: "Batuhan",
        surname: "CAN",
        eMail: "kamilbatuhancan@hotmail.com",
        password: await bcrypt.hash("123456789", 10),
      },
    ]);

    const restaurant = await Restaurant.create({
      name: "Lezzetli Restaurant",
      address: "İstanbul, Bağcılar, Şişli Mah.",
      phoneNumber: "5551234567",
      email: "contact@lezzetlirestaurant.com",
    });

    const category = await Category.create({
      name: "Yemekler",
      description: "Lezzetli yemek çeşitleri",
      restaurantId: restaurant.id,
    });

    await Product.create({
      name: "Pizza Margherita",
      price: 49.99,
      description: "İtalyan pizzası, domates sosu ve mozzarella peyniri ile",
      categoryId: category.id,
    });

    console.log("Dummy data başarıyla eklendi.");
  } catch (error) {
    console.error("Dummy data eklerken hata oluştu:", error);
  }
};
