import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/user-context";
export default function Orders() {
  const { tableid, tablename } = useParams();
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [orders, setOrders] = useState<any>([]);
  const [newOrders, setNewOrders] = useState<any>([]);
  const [product, setProduct] = useState<any>([]);
  const [openCategory, setOpenCategory] = useState(null);
  const {  name } = useContext(UserContext);
  

  const toggleCategory = (id: any) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const fetchWaiters = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get<[]>(
        `${
          import.meta.env.VITE_API_CLIENT_URL
        }/waiter/getAllCategoryAndProduct`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProduct(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message === "Token uyuşmuyor.") {
          navigate("/login");
        }
      }
    }
  };
  const fetchOrders = async () => {
    try {
      setOrders([]);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get<[]>(
        `${
          import.meta.env.VITE_API_CLIENT_URL
        }/waiter/getOrder/${tableid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message === "Token uyuşmuyor.") {
          navigate("/login");
        }
      }
    }
  };

  useEffect(() => {
    fetchWaiters();
    fetchOrders();
  }, []);

  const calculateTotalPrice = (orders: any) => {
    return orders.reduce(
      (total: any, order: any) => total + Number(order.price),
      0
    );
  };


  useEffect(() => {
    setTotalPrice(calculateTotalPrice(orders));
  }, [orders]);

  const socket = new WebSocket(import.meta.env.VITE_API_SOCKET);

  const handleSaveOrder = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const orderData = {
        tableName: tablename,
        orders: newOrders.map((order: any) => ({
          name: order.name
        })),
        waiterName:name
      };

      socket.send(JSON.stringify(orderData));

      await axios.post(
        `${import.meta.env.VITE_API_CLIENT_URL}/waiter/createOrder`,
        {
          tableId: tableid,
          orders: newOrders.map((order: any) => ({
            name: order.name,
            price: order.price,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewOrders([]);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.onopen = () => console.log("WebSocket bağlantısı kuruldu.");
    socket.onmessage = (event) => console.log("Sunucudan mesaj:", event.data);
    socket.onerror = (error) => console.error("WebSocket hatası:", error);
    socket.onclose = () => console.log("WebSocket bağlantısı kapandı.");
  
    return () => socket.close();
  }, []);


  const handleDeleteOrder = async (orderId: any) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${import.meta.env.VITE_API_CLIENT_URL}/waiter/deleteOrder/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1d1d1d] text-white p-3 h-screen">
      <div className="flex items-center px-5 justify-between w-full">
        <div
          onClick={() => {
            navigate("/admin");
          }}
          className="flex cursor-pointer items-center justify-center"
        >
          <IoChevronBack className="mt-0.5" />
          Geri Dön
        </div>
        <h1 className="text-xl font-bold">Masa - {tablename}</h1>
      </div>
      <div className="h-[calc(100%_-_36px)] mt-5 overflow-y-auto hide-scrollbar">
        <div className="flex flex-col gap-2 ">
          <div className="flex gap-3">
            <div className="font-bold">Ürünler</div>
          </div>
          <div className="w-full  mx-auto">
            {product.map((category: any) => (
              <div key={category.id} className="mb-2">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#303030] bg-[#272727] shadow-md rounded-md"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="text-md font-bold text-white">
                    {category.name}
                  </div>
                </div>
                {openCategory === category.id &&
                  category.products.length > 0 && (
                    <div className="bg-[#1f1f1f] p-3 rounded-md mt-1 flex flex-col gap-2">
                      {category.products.map((item: any) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setOrders([...orders, item]);
                            setNewOrders([...newOrders, item]);
                          }}
                          className="text-white cursor-pointer hover:text-amber-500 "
                        >
                          <div className="flex w-full justify-between rounded-md bg-[#343434] gap-2 p-3">
                            <div>{item.name}</div> <div>{item.price}₺</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="font-bold">Masanın Siparişleri</div>
          </div>
          {orders.length === 0 ? (
            <div className="text-white text-center p-4  rounded-md">
              Şu an masanın siparişi yok
            </div>
          ) : (
            orders.map((order: any, index: any) => (
              <div
                key={index}
                onClick={() => handleDeleteOrder(order.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#404040] bg-[#353535] shadow-md rounded-md"
              >
                <div className="text-md font-bold">{order.name}</div>
                <div className=" text-sm font-semibold">{order.price} ₺</div>
              </div>
            ))
          )}
          <div className="flex items-center">
            <div
              onClick={handleSaveOrder}
              className="px-5 py-2 bg-[#2f2f2f] flex justify-center items-center rounded-sm cursor-pointer"
            >
              Kaydet
            </div>
            <div className="my-5 w-full flex justify-end">
              Masanın Toplam Ücreti : {totalPrice} ₺
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
