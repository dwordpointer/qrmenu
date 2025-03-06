import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

function Product() {
  const { catid, prodid } = useParams();

  const [rest, setRest] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const categoriesRes = await axios.get(
        `${import.meta.env.VITE_API_CLIENT_URL}/auth/product/${prodid}`
      );

      setRest(categoriesRes.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message);
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
    return (
      <div className="text-center h-screen bg-[#1d1d1d] text-gray-600"></div>
    );
  if (error)
    return (
      <div className="text-center bg-[#1d1d1d] h-screen text-red-500"></div>
    );

  return (
    <div className="h-screen bg-[#1d1d1d] overflow-y-auto text-white flex flex-col items-center">
      <div
        onClick={() => {
          navigate(`/category/${catid}`);
        }}
        className="flex items-center gap-2 cursor-pointer mt-5"
      >
        <FaArrowLeft /> Kategorileri incele
      </div>
      <div className="mt-5 w-full max-w-2xl px-5">
        {rest.length > 0 ? (
          rest.map((item) => (
            item.enable ? (<div
              key={item.id}
              className="bg-gray-800 rounded-2xl shadow-md p-5 mb-4 hover:bg-gray-700 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover mr-5"
                />

                <div>
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <h2 className="text-xl font-semibold">{item.description}</h2>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">{item.price} ₺</h2>
              </div>
            </div>):""
          ))
        ) : (
          <div className="text-center h-screen bg-[#1d1d1d] text-gray-400">
            Hiç ürün bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
