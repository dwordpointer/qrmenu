import RestaurantModel from '../models/restaurantModel.js';
import CategoryModel from '../models/categoryModel.js';
import ProductModel from '../models/productModel.js';
import UserModel from '../models/userModel.js';
import TableModel from '../models/tablesModel.js';
import bcrypt from 'bcrypt';

export const getRestaurant = async (req, res) => {
  try {
    const restaurants = await RestaurantModel.findAll();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addRestaurant = async (req, res) => {
  try {
    const { name, address, phone, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Restaurant name is required' });
    }

    const newRestaurant = await RestaurantModel.create({
      name,
      address,
      phone,
      image,
    });

    res.status(201).json({
      message: 'Restaurant added successfully',
      restaurant: newRestaurant,
    });
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, image } = req.body;

  try {
    const restaurant = await RestaurantModel.findByPk(id);
    if (!restaurant)
      return res.status(404).json({ message: 'Restaurant not found' });

    restaurant.name = name || restaurant.name;
    restaurant.address = address || restaurant.address;
    restaurant.phone = phone || restaurant.phone;
    restaurant.image = image || restaurant.image;

    await restaurant.save();
    res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  try {
    const category = await CategoryModel.findByPk(id);
    if (!category)
      return res.status(404).json({ message: 'Category not found' });

    category.name = name || category.name;
    category.image = image || category.image;

    await category.save();
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image } = req.body;

  try {
    const product = await ProductModel.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;

    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await RestaurantModel.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const categories = await CategoryModel.findAll({
      where: { restaurantId: id },
    });

    for (let category of categories) {
      await ProductModel.destroy({
        where: { categoryId: category.id },
      });
    }

    await CategoryModel.destroy({
      where: { restaurantId: id },
    });

    await restaurant.destroy();

    return res.status(200).json({
      message: 'Restaurant and its associated categories and products deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
  }
};

export const addCategory = async (req, res) => {
  const { name, restaurantId, image } = req.body;

  try {
    const restaurant = await RestaurantModel.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const category = await CategoryModel.create({ name, restaurantId, image });

    return res.status(201).json({ category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding category', error: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching categories' });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await ProductModel.destroy({ where: { categoryId: id } });

    await category.destroy();

    return res.status(200).json({
      message: 'Category and associated products deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const products = await ProductModel.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addProduct = async (req, res) => {
  const { name, price, description, categoryId, image } = req.body;

  try {
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const product = await ProductModel.create({
      name,
      price,
      description,
      categoryId,
      image,
    });

    return res.status(201).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

export const enableRestaurant = async (req, res) => {
  const { id } = req.params;
  const { enable } = req.body;

  try {
    const restaurant = await RestaurantModel.findByPk(id);
    if (!restaurant)
      return res.status(404).json({ message: 'Restaurant not found' });

    restaurant.enable = enable;

    await restaurant.save();
    res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant', error: error.message });
  }
};

export const enableCategory = async (req, res) => {
  const { id } = req.params;
  const { enable } = req.body;

  try {
    const category = await CategoryModel.findByPk(id);
    if (!category)
      return res.status(404).json({ message: 'Category not found' });

    category.enable = enable;

    await category.save();

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

export const enableProduct = async (req, res) => {
  const { id } = req.params;
  const { enable } = req.body;

  try {
    const product = await ProductModel.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.enable = enable;

    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const getAllWaiters = async (req, res) => {
  try {
    const Users = await UserModel.findAll();
    res.status(200).json(Users);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const postAddWaiters = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email: email,
      password: hashedPassword,
      level: 1,
    });

    res.status(200).json({
      message: 'Waiter added successfully!',
      user: newUser,
    });
  } catch (error) {
    console.log('Error adding waiter:', error);
    res.status(500).json({
      message: 'Failed to add waiter',
      error: error.message,
    });
  }
};

export const addTable = async (req, res) => {
  const { tableNumber, restaurantId, status } = req.body;

  try {
    const table = await TableModel.create({
      tableNumber,
      restaurantId,
      status,
    });

    return res.status(201).json({ table });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding table', error: error.message });
  }
};

export const getTable = async (req, res) => {
  try {
    const tables = await TableModel.findAll();
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllTables = async (req, res) => {
  try {
    const tables = await TableModel.findAll();
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const postAddTables = async (req, res) => {
  const { tableNumber, restaurantId, status } = req.body;
  try {
    const table = await TableModel.create({
      tableNumber,
      restaurantId,
      status
    });
    return res.status(201).json({ table });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding table', error: error.message });
  }
};

export const deleteTables = async (req, res) => {
  const { id } = req.params;
  try {
    const table = await TableModel.findByPk(id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    await table.destroy();
    return res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting table', error: error.message });
  }
};

export const deleteWaiters = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Waiter not found' });
    }
    await user.destroy();
    return res.status(200).json({ message: 'Waiter deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting waiter', error: error.message });
  }
};
