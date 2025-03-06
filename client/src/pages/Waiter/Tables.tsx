import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Waiter {
  id: number;
  tableNumber: string;
}

export default function Tables() {
  const [tables, setTables] = useState<Waiter[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchWaiters = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get<Waiter[]>(
        `${import.meta.env.VITE_API_CLIENT_URL}/waiter/tables`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTables(response.data);
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

  if (loading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Masalar</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4 w-full">
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={()=>{navigate(`/orders/${table.id}/${table.tableNumber}`)}}
              className="flex items-center justify-center p-4 cursor-pointer hover:bg-amber-100 bg-white shadow-md rounded-md"
            >
              {table.tableNumber}
            </div>
          ))}
        </div>
    </div>
  );
}
