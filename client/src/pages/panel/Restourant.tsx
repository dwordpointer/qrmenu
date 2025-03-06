import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaEdit, FaCheck, FaTimes, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  image: string;
}

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    image: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedRestaurant, setEditedRestaurant] = useState<Partial<Restaurant>>(
    {}
  );
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get<Restaurant[]>(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/restourant`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRestaurants(response.data);
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

  const addRestaurant = async () => {
    if (!newRestaurant.name.trim())
      return alert("Restaurant name is required!");

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/addRestourant`,
        newRestaurant,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRestaurants([...restaurants, response.data.restaurant]);
      setNewRestaurant({ name: "", address: "", image: "" });
    } catch (error) {
      console.error("Error adding restaurant:", error);
    }
  };

  const deleteRestaurant = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/restourant/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const startEditing = (restaurant: Restaurant) => {
    setEditingId(restaurant.id);
    setEditedRestaurant({ ...restaurant });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedRestaurant({});
  };

  const toggleCategoryEnable = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/restourantEnable/${id}`,
        { enable: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

    } catch (error) {
      console.error("Error updating category enable state:", error);
    }
  };
  const toggleCategoryDisable = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/restourantEnable/${id}`,
        { enable: false },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

    } catch (error) {
      console.error("Error updating category enable state:", error);
    }
  };

  const saveRestaurant = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/restourant/${id}`,
        editedRestaurant,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...response.data } : r))
      );
      setEditingId(null);
      setEditedRestaurant({});
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Restaurant Management
      </h1>

      {/* ✅ Yeni Restoran Ekleme Formu */}
      <div className="bg-gray-100 p-4 mb-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Add New Restaurant</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={newRestaurant.name}
            onChange={(e) =>
              setNewRestaurant({ ...newRestaurant, name: e.target.value })
            }
            className="border p-2 rounded w-1/2"
          />
          <input
            type="text"
            placeholder="Image Link"
            value={newRestaurant.image}
            onChange={(e) =>
              setNewRestaurant({ ...newRestaurant, image: e.target.value })
            }
            className="border p-2 rounded w-1/2"
          />
          <input
            type="text"
            placeholder="Address"
            value={newRestaurant.address}
            onChange={(e) =>
              setNewRestaurant({ ...newRestaurant, address: e.target.value })
            }
            className="border p-2 rounded w-1/2"
          />

          <button
            onClick={addRestaurant}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Address</th>
              <th className="py-3 px-6 text-center">Enabled</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant, index) => (
              <tr
                key={restaurant.id}
                className={`$${
                  index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                } hover:bg-gray-200`}
              >
                <td className="py-3 px-6">{restaurant.id}</td>
                <td className="py-3 px-6 font-semibold">
                  {editingId === restaurant.id ? (
                    <input
                      value={editedRestaurant.name || ""}
                      onChange={(e) =>
                        setEditedRestaurant({
                          ...editedRestaurant,
                          name: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    restaurant.name
                  )}
                </td>
                <td className="py-3 px-6">
                  {editingId === restaurant.id ? (
                    <input
                      value={editedRestaurant.address || ""}
                      onChange={(e) =>
                        setEditedRestaurant({
                          ...editedRestaurant,
                          address: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    restaurant.address || "N/A"
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => toggleCategoryEnable(restaurant.id)}
                      className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => toggleCategoryDisable(restaurant.id)}
                      className="bg-red-500 text-white p-3 rounded-lg hover:bg-green-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-6 text-center flex justify-center gap-2">
                  {editingId === restaurant.id ? (
                    <>
                      <button
                        onClick={() => saveRestaurant(restaurant.id)}
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(restaurant)}
                        className="bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteRestaurant(restaurant.id)}
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
  );
}
