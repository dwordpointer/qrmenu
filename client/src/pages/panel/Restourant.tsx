import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";
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
  const navigate = useNavigate();
  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get<Restaurant[]>(
        "https://qrmenu-server.vercel.app//admin/restourant",
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
        "https://qrmenu-server.vercel.app//admin/addRestourant",
        newRestaurant,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);

      setRestaurants([...restaurants, response.data.restaurant]); // Listeye ekle
      setNewRestaurant({ name: "", address: "", image: "" }); // Formu sıfırla
    } catch (error) {
      console.error("Error adding restaurant:", error);
    }
  };

  const deleteRestaurant = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`https://qrmenu-server.vercel.app//admin/restourant/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.id !== id)
      );
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading) return <div className="text-center text-gray-600"></div>;
  if (error) return <div className="text-center text-red-500"></div>;

  return (
    <div className="container mx-auto p-6">
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
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant, index) => (
              <tr
                key={restaurant.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                } hover:bg-gray-200`}
              >
                <td className="py-3 px-6">{restaurant.id}</td>
                <td className="py-3 px-6 font-semibold">{restaurant.name}</td>
                <td className="py-3 px-6">{restaurant.address || "N/A"}</td>
                <td className="py-3 px-6 text-center flex justify-center gap-2">
                  <button
                    onClick={() => deleteRestaurant(restaurant.id)}
                    className="bg-red-500 text-white px-3 py-3 rounded-lg hover:bg-red-600 flex items-center gap-2"
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
  );
}
