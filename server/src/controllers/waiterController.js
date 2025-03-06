import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
import TableModel from "../models/tablesModel.js";
import {Order} from "../models/orderModels.js";

const getAllTables = async (req, res) => {
  try {
    const Tables = await TableModel.findAll();
    res.status(200).json(Tables);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllCategoryAndProduct = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll({
      include: [
        {
          model: ProductModel,
          as: "products",
        },
      ],
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { tableId, orders } = req.body;

    const createdOrders = await Promise.all(
      orders.map((orderItem) =>
        Order.create({
          tableId,
          waiterName: req.user.name,
          name: orderItem.name,
          price: orderItem.price,
        })
      )
    );

    res.status(201).json({
      message: "Siparişler başarıyla oluşturuldu",
      orders: createdOrders,
    });
  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error);
    res.status(500).json({
      success: false,
      message: "Siparişler oluşturulurken bir hata oluştu",
    });
  }
};

const getOrder = async (req, res) => {
  const { tableid } = req.params;
  const orders = await Order.findAll({ where: { tableId: tableid } });
  res.status(200).json(orders);
};

const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  await Order.destroy({ where: { id: orderId } });
  res.status(200).json({ message: "Sipariş silindi" });
};

export {
  getAllTables,
  getAllCategoryAndProduct,
  createOrder,
  getOrder,
  deleteOrder,
};
