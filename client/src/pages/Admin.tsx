import { useContext, useState } from "react";
import LeftBar from "../components/LeftBar";
import Restourant from "./panel/Restourant";
import Category from "./panel/Category";
import Product from "./panel/Product";
import Waiter from "./panel/Waiter";
import Tabless from "./Waiter/Tables";
import { UserContext } from "../context/user-context";
import Tables from "./panel/Tables";

export default function Dashboard() {
  const { level } = useContext(UserContext);
  const [activePage, setActivePage] = useState<number>(0);
  const rendererContent = (activePage: number) => {
    switch (activePage) {
      case 0:
        return level == "2" ? <Restourant /> : <Tabless/>;
      case 1:
        return <Category />;
      case 2:
        return <Product />;
      case 3:
        return <Waiter />;
      case 4:
        return <Tables />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex">
      <LeftBar setActivePage={setActivePage} activePage={activePage} />
      <div className="h-screen flex-1">{rendererContent(activePage)}</div>
    </div>
  );
}
