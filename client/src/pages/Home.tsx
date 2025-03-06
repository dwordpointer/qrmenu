import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageContext } from "../context/image-context";

function App() {
  const [rest, setRest] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setImage } = useContext(ImageContext);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const categoriesRes = await axios.get(
        `${import.meta.env.VITE_API_CLIENT_URL}/auth/restoran`
      );

      setRest(categoriesRes.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error fetching data");
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <div className="text-center text-gray-600 h-screen bg-[#1d1d1d]"></div>;
  if (error)
    return <div className="text-center text-red-500 h-screen bg-[#1d1d1d]"></div>;

  return (
    <div className="h-screen bg-[#1d1d1d] overflow-y-auto text-white flex flex-col items-center">
      <div className="mt-10 text-xl font-semibold">
        Bir restoran seçimi yapınız
      </div>
      <div className="mt-5 w-full max-w-2xl px-5">
        {rest.length > 0 ? (
          rest.map((item) => (
            item.enable ? (<div
              key={item.id}
              className="bg-gray-800 rounded-2xl shadow-md p-5 mb-4 hover:bg-gray-700 transition-all cursor-pointer flex items-center"
              onClick={() => {
                navigate(`/category/${item.id}`);
                setImage(item.image)
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-lg object-cover mr-5"
              />

              <div>
                <h2 className="text-2xl font-bold">{item.name}</h2>
                <p className="text-gray-400">
                  Adres: {item.address || "Adres bilgisi yok"}
                </p>
              </div>
            </div>): ""
          )) 
        ) : (
          <div className="text-center text-gray-400">
            Hiç restoran bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
