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
        name: "Hasan",
        surname: "ACAR",
        eMail: "hasanacar@hotmail.com",
        password: await bcrypt.hash("102030++", 10),
      },
    ]);

    console.log("Dummy data başarıyla eklendi.");
  } catch (error) {
    console.error("Dummy data eklerken hata oluştu:", error);
  }
};
