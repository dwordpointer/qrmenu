import { Order } from "../models/orderModels.js";
import Product from "../models/productModel.js";
import Table from "../models/tablesModel.js";

const getTables = async (req, res) => {
  try {
    const tables = await Table.findAll();
    res.status(200).json(tables);
  } catch (error) {
    console.error("Masalar getirilirken hata:", error);
    res.status(500).json({ error: "Masalar getirilemedi" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Order.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error("Ürünler getirilirken hata:", error);
    res.status(500).json({ error: "Ürünler getirilemedi" });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Order.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }

    await Order.destroy({
      where: { id: productId },
    });

    res.status(200).json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    console.error("Sipariş oluşturulurken hata:", error);
    res.status(500).json({ error: "Sipariş oluşturulamadı" });
  }
};

export { getTables, getProducts, deleteProduct };
