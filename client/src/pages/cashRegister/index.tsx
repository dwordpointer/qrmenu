import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

interface Table {
  id: number;
  tableNumber: string;
  isOccupied: boolean;
  orders?: Order[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  tableId: number;
}

interface Order {
  id: number;
  productId: number;
  quantity: number;
  tableId: number;
}

function CashRegister() {
  const [tables, setTables] = useState<Table[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchTables();
    fetchProducts();

    const interval = setInterval(() => {
      fetchTables();
      fetchProducts();
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_CLIENT_URL}/cashRegister/tables`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTables(response.data);
    } catch (error) {
      console.error("Masalar yüklenirken hata oluştu:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_CLIENT_URL}/cashRegister/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Ürünler yüklenirken hata oluştu:", error);
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!selectedTable) return;
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_CLIENT_URL
        }/cashRegister/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProducts();
    } catch (error) {
      console.error("Sipariş eklenirken hata oluştu:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Masalar</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {tables.map((table) => {
            const hasOrder = products.some(
              (product) => String(product.tableId) === String(table.id)
            );

            return (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`p-4 rounded-lg cursor-pointer shadow-md text-center transition-all 
        ${hasOrder ? "bg-green-400 text-black" : "bg-white text-black"} 
        ${selectedTable?.id === table.id ? "bg-green-600" : ""}`}
              >
                <div className="font-bold">Masa {table.tableNumber}</div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTable && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Masa {selectedTable.tableNumber} - Ürünler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.filter(
              (product) => String(product.tableId) === String(selectedTable.id)
            ).length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-lg py-4">
                Bu masanın ürünü bulunmuyor
              </div>
            ) : (
              <>
                {products
                  .filter(
                    (product) =>
                      String(product.tableId) === String(selectedTable.id)
                  )
                  .map((product) => (
                    <div
                      key={product.id}
                      className="bg-white flex justify-between p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div>
                      <div className="font-bold">{product.name}</div>
                      <div className="text-gray-600">{product.price} TL</div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-2 py-1 cursor-pointer rounded text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                <div className="col-span-full mt-6 bg-white p-4 rounded-lg shadow-md">
                  <div className="text-xl font-bold text-right">
                    Toplam:{" "}
                    {products
                      .filter(
                        (product) =>
                          String(product.tableId) === String(selectedTable.id)
                      )
                      .reduce(
                        (total, product) => total + product.price,
                        0
                      )}{" "}
                    TL
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CashRegister;
