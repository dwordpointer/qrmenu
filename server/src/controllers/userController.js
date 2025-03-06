import User from '../models/userModel.js';
import CategoryModel from '../models/categoryModel.js';
import ProductModel from '../models/productModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(401).json({ message: 'Email adresi boş bırakılamaz!' });
    }
    if (!password) {
      return res.status(401).json({ message: 'Şifre boş bırakılamaz!' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Kullanıcı adı veya şifreniz hatalı!' });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        level: user.level,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: '1d',
      }
    );

    return res.status(200).json({
      id: user.id,
      name: user.name,
      level: user.level,
      message: 'Giriş Başarılı!',
      accessToken: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Bir hata oluştu!' });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const categories = await CategoryModel.findAll({
      where: { restaurantId: id },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error('Kategori getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const products = await ProductModel.findAll({
      where: { categoryId: id },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Kategori getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

export const checkLogin = async (req, res) => {
  const authHeader = req.body.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yetkilendirme hatası' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Geçersiz token' });
    }

    res.json({
      name: decoded.name,
      level: decoded.level,
    });
  });
};
