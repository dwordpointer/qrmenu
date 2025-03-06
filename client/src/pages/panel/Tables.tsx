import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Waiter {
  id: number;
  tableNumber: string;
}

export default function Tables() {
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [newWaiter, setNewWaiter] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchWaiters = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get<Waiter[]>(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/tables`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWaiters(response.data);
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

  useEffect(() => {
    fetchWaiters();
  }, []);

  const addWaiter = async () => {
    const token = localStorage.getItem("accessToken");
    if (!newWaiter.trim()) return alert("Masa İsmi Veya Numarası Zorunlu");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/addTables`,
        { tableNumber: newWaiter },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      setWaiters([...waiters, response.data]);
      setNewWaiter("");
    } catch (error) {
      console.error("Error adding waiter:", error);
    }
  };

  const deleteWaiter = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_CLIENT_URL}/admin/tables/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setWaiters(waiters.filter((waiter) => waiter.id !== id));
    } catch (error) {
      console.error("Error deleting waiter:", error);
    }
  };

  if (loading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Masalar</h1>

      <div className="flex gap-4">
        <div className="mb-4">
          <input
            type="text"
            value={newWaiter}
            onChange={(e) => setNewWaiter(e.target.value)}
            className="border p-2 rounded"
            placeholder="Masa İsmi Veya Numarası"
          />
        </div>

        <div className="mb-4">
          <button
            onClick={addWaiter}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ekle
          </button>
        </div>
      </div>

      <ul>
        {waiters.map((waiter) => (
          <li
            key={waiter.id}
            className="flex justify-between items-center mb-2"
          >
            <span>{waiter.tableNumber}</span>
            <button
              onClick={() => deleteWaiter(waiter.id)}
              className="ml-2 bg-red-500 cursor-pointer text-white px-2 py-1 rounded"
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
