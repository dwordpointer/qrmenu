const User = require("../models/userModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(401).json({ message: "Email adresi boş bırakılamaz!" });
    }
    if (!password) {
      return res.status(401).json({ message: "Şifre boş bırakılamaz!" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Kullanıcı adı veya şifreniz hatalı!" });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.eMail,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      id: user.id,
      name: user.name,
      message: "Giriş Başarılı!",
      accessToken: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu!" });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const categories = await CategoryModel.findAll({
      where: { restaurantId: id },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Kategori getirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const categories = await ProductModel.findAll({
      where: { categoryId: id },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Kategori getirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};