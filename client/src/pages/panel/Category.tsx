import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  categories?: Category[];
}

interface Category {
  id: number;
  name: string;
  image?: string;
  restaurantId: number;
  enable: boolean;
}

export default function Category() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    restaurantId: 0,
    image: "",
  });
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editedCategory, setEditedCategory] = useState<Partial<Category>>({});
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const [restaurantsRes, categoriesRes] = await Promise.all([
        axios.get<Restaurant[]>(
          `${import.meta.env.VITE_API_CLIENT_URL}/admin/restourant`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get<Category[]>(
          `${import.meta.env.VITE_API_CLIENT_URL}/admin/category`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      setRestaurants(restaurantsRes.data);
      setCategories(categoriesRes.data);
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

  const addCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.restaurantId) {
      return alert("Category name and restaurant are required!");
    }

    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/addCategory`,
        newCategory,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories([...categories, response.data.category]);
      setNewCategory({ name: "", restaurantId: 0, image: "" });
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/category/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const startEditing = (category: Category) => {
    setEditCategoryId(category.id);
    setEditedCategory({ name: category.name, image: category.image });
  };

  const cancelEditing = () => {
    setEditCategoryId(null);
    setEditedCategory({});
  };

  const saveCategory = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const updatedCategory = { ...editedCategory };

      const response = await axios.put(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/category/${id}`,
        updatedCategory,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? response.data.category : cat))
      );
      cancelEditing();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const toggleCategoryEnable = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.put(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/categoryEnable/${id}`,
        { enable: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id
            ? { ...category, enable: response.data.enabled }
            : category
        )
      );
    } catch (error) {
      console.error("Error updating category enable state:", error);
    }
  };
  const toggleCategoryDisable = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.put(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/categoryEnable/${id}`,
        { enable: false },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id
            ? { ...category, enable: response.data.enabled }
            : category
        )
      );
    } catch (error) {
      console.error("Error updating category enable state:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center text-gray-600 mt-5">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-5">{error}</div>;

  return (
    <div className="container mx-auto p-6 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Category Management
      </h1>

      <div className="bg-gray-100 p-4 mb-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Add New Category</h2>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="border p-2 rounded w-full md:w-1/3"
          />
          <input
            type="text"
            placeholder="Image Link"
            value={newCategory.image}
            onChange={(e) =>
              setNewCategory({ ...newCategory, image: e.target.value })
            }
            className="border p-2 rounded w-full md:w-1/3"
          />
          <select
            value={newCategory.restaurantId}
            onChange={(e) =>
              setNewCategory({ ...newCategory, restaurantId: +e.target.value })
            }
            className="border p-2 rounded w-full md:w-1/3"
          >
            <option value={0}>Select Restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>

          <button
            onClick={addCategory}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">{restaurant.name}</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-6 text-left">Category ID</th>
                  <th className="py-3 px-6 text-left">Category Name</th>
                  <th className="py-3 px-6 text-left">Image Link</th>
                  <th className="py-3 px-6 text-center">Enabled</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories
                  .filter((category) => category.restaurantId === restaurant.id)
                  .map((category) => (
                    <tr
                      key={category.id}
                      className="bg-gray-100 hover:bg-gray-200"
                    >
                      <td className="py-3 px-6">{category.id}</td>
                      <td className="py-3 px-6 font-semibold">
                        {editCategoryId === category.id ? (
                          <input
                            type="text"
                            value={editedCategory.name || ""}
                            onChange={(e) =>
                              setEditedCategory({
                                ...editedCategory,
                                name: e.target.value,
                              })
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          category.name
                        )}
                      </td>
                      <td className="py-3 px-6">
                        {editCategoryId === category.id ? (
                          <input
                            type="text"
                            value={editedCategory.image || ""}
                            onChange={(e) =>
                              setEditedCategory({
                                ...editedCategory,
                                image: e.target.value,
                              })
                            }
                            className="border p-1 rounded w-full"
                          />
                        ) : (
                          category.image || "-"
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex gap-3">
                          <button
                            onClick={() => toggleCategoryEnable(category.id)}
                            className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={() => toggleCategoryDisable(category.id)}
                            className="bg-red-500 text-white p-3 rounded-lg hover:bg-green-600"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center flex justify-center gap-2">
                        {editCategoryId === category.id ? (
                          <>
                            <button
                              onClick={() => saveCategory(category.id)}
                              className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                            >
                              <FaSave />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600"
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(category)}
                              className="bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteCategory(category.id)}
                              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
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
