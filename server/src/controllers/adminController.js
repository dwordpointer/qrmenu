const RestaurantModel = require("../models/restaurantModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");

exports.getRestaurant = async (req, res) => {
  try {
    const restaurants = await RestaurantModel.findAll();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addRestaurant = async (req, res) => {
  try {
    const { name, address, phone,image } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Restaurant name is required" });
    }

    const newRestaurant = await RestaurantModel.create({
      name,
      address,
      phone,
      image
    });

    res.status(201).json({
      message: "Restaurant added successfully",
      restaurant: newRestaurant,
    });
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await RestaurantModel.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const categories = await CategoryModel.findAll({
      where: { restaurantId: id },
    });

    for (let category of categories) {
      await ProductModel.destroy({
        where: { categoryId: category.id },
      });
    }

    // Kategorileri siliyoruz
    await CategoryModel.destroy({
      where: { restaurantId: id },
    });

    // Restoranı siliyoruz
    await restaurant.destroy();

    return res
      .status(200)
      .json({
        message:
          "Restaurant and its associated categories and products deleted successfully",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error deleting restaurant", error: error.message });
  }
};

exports.addCategory = async (req, res) => {
  const { name, restaurantId,image } = req.body;

  try {
    const restaurant = await RestaurantModel.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const category = await CategoryModel.create({ name, restaurantId,image });

    return res.status(201).json({ category });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error adding category", error: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching categories" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await ProductModel.destroy({ where: { categoryId: id } });

    await category.destroy();

    return res
      .status(200)
      .json({
        message: "Category and associated products deleted successfully",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const products = await ProductModel.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  const { name, price, description, categoryId,image } = req.body;

  try {
    const category = await CategoryModel.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const product = await ProductModel.create({
      name,
      price,
      description,
      categoryId,
      image
    });

    return res.status(201).json({ product });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
