import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  categoryId: number;
  price:number;
  description:string;
  image:string;
}

export default function CategoryProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    categoryId: 0,
    image:""
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const [categoriesRes, productsRes] = await Promise.all([
        axios.get<Category[]>("https://qrmenu-server.vercel.app//admin/category", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<Product[]>("https://qrmenu-server.vercel.app//admin/product", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error fetching data");
        if (err.response?.data?.message === "Token uyuşmuyor.") {
          navigate("/login");
        }
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.categoryId) {
      return alert("Product name and category are required!");
    }

    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "https://qrmenu-server.vercel.app//admin/addProduct",
        newProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts([...products, response.data.product]);
      setNewProduct({ name: "", price: 0, description: "", categoryId: 0,image:"" });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`https://qrmenu-server.vercel.app//admin/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center text-gray-600"></div>;
  if (error)
    return <div className="text-center text-red-500"></div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Product Management by Category
      </h1>

      <div className="bg-gray-100 p-4 mb-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Add New Product</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="border p-2 rounded w-1/2"
          />
          <input
            type="text"
            placeholder="Image Link"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
            className="border p-2 rounded w-1/2"
          />
          <input
            type="number"
            placeholder="Product Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: parseFloat(e.target.value) || 0,
              })
            }
            className="border p-2 rounded w-1/2"
          />
          <input
            type="text"
            placeholder="Product Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="border p-2 rounded w-1/2"
          />
          <select
            value={newProduct.categoryId}
            onChange={(e) =>
              setNewProduct({ ...newProduct, categoryId: +e.target.value })
            }
            className="border p-2 rounded w-1/2"
          >
            <option value={0}>Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            onClick={addProduct}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category.id} className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-6 text-left">Product ID</th>
                  <th className="py-3 px-6 text-left">Product Name</th>
                  <th className="py-3 px-6 text-left">Product Price</th>
                  <th className="py-3 px-6 text-left">Product Desc</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((product) => product.categoryId === category.id)
                  .map((product) => (
                    <tr
                      key={product.id}
                      className="bg-gray-100 hover:bg-gray-200"
                    >
                      <td className="py-3 px-6">{product.id}</td>
                      <td className="py-3 px-6 font-semibold">
                        {product.name}
                      </td>
                      <td className="py-3 px-6 font-semibold">
                        {product.price}
                      </td>
                      <td className="py-3 px-6 font-semibold">
                        {product.description}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
