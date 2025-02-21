import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
interface LeftBarProps {
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
}

export default function LeftBar({ activePage, setActivePage }: LeftBarProps) {
  const navigate = useNavigate()
  const menuItems = ["Restoranlar", "Kategoriler", "Ürünler"];

  return (
    <div className="bg-[#f5f6fa] h-screen w-60 gap-5 flex flex-col">
      <div className="flex flex-col h-full gap-5">
        <div className="pt-5 w-full flex justify-center font-semibold">
          QR Yönetim Sayfası
        </div>
        <div className="w-full px-5">
          <div className="h-px bg-[#e1e4ec] w-full"></div>
        </div>
        <div className="w-full gap-1 flex flex-col px-5">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`p-1 px-3 rounded-lg cursor-pointer ${
                activePage === index
                  ? "bg-[#d1d4e0] font-semibold"
                  : "hover:bg-[#e7e9f0]"
              }`}
              onClick={() => setActivePage(index)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-5 py-5">
        <div onClick={()=>{navigate("/login");localStorage.removeItem("accessToken")}} className="w-full h-10 flex justify-center items-center hover:bg-[#e7e9f0] rounded-lg cursor-pointer">
          Çıkış Yap
        </div>
      </div>
    </div>
  );
}
