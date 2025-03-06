import React, { useEffect, useState } from "react";
import { UserContext } from "../context/user-context";
import axios from "axios";

interface Props {
  children: React.ReactNode;
}

function UserProvider({ children }: Props) {
  const [name, setName] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);

  const checkLogin = async () => {
    const token = localStorage.getItem("accessToken");
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_CLIENT_URL}/auth/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setName(response.data.name);
      setLevel(response.data.level);

    } catch (error) {
      console.error("Giriş durumu kontrol edilirken hata oluştu");

    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <UserContext.Provider value={{ name, setName, level, setLevel }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
