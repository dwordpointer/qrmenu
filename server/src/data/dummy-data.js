import User from '../models/userModel.js';
import Restaurant from '../models/restaurantModel.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import Table from '../models/tablesModel.js';
import bcrypt from 'bcrypt';

const addDummyData = async () => {
  try {
    await User.bulkCreate([
      {
        name: 'Hasan',
        surname: 'ACAR',
        email: 'hasanacar@hotmail.com',
        password: await bcrypt.hash('102030++', 10),
        level: 2,
      },
      {
        name: 'Kasa',
        surname: 'Kasa',
        email: 'kasa@hotmail.com',
        password: await bcrypt.hash('102030++', 10),
        level: 3,
      },
    ]);

    console.log('Dummy data başarıyla eklendi.');
  } catch (error) {
    console.error('Dummy data eklerken hata oluştu:', error);
  }
};

export default addDummyData;
