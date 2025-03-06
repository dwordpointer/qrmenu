import { Dispatch, SetStateAction, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
interface LeftBarProps {
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
}

export default function LeftBar({ activePage, setActivePage }: LeftBarProps) {
  const { level, name } = useContext(UserContext);
  const navigate = useNavigate();
  
  const allMenuItems = [
    { name: "Restoranlar", minLevel: 2 },
    { name: "Kategoriler", minLevel: 2 },
    { name: "Ürünler", minLevel: 2 },
    { name: "Garsonlar", minLevel: 2 },
    { name: "Masalar", minLevel: 2 },
    { name: "Masalar", minLevel: 1 },
  ];
  
  const userLevel = Number(level);
  const menuItems = allMenuItems.filter(item => userLevel == item.minLevel);
  
  return (
    <div className="bg-[#f5f6fa] h-screen w-40 md:w-60 gap-5 flex flex-col">
      <div className="flex flex-col h-full gap-5">
        <div className="pt-5 w-full flex justify-center font-semibold">
          Hoşgeldin {name}
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
              {item.name}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-5 py-5">
        <div
          onClick={() => {
            navigate("/login");
            localStorage.removeItem("accessToken");
          }}
          className="w-full h-10 flex justify-center items-center hover:bg-[#e7e9f0] rounded-lg cursor-pointer"
        >
          Çıkış Yap
        </div>
      </div>
    </div>
  );
}
