import { useState } from "react";
import LeftBar from "../components/LeftBar";
import Restourant from "./panel/Restourant";
import Category from "./panel/Category";
import Product from "./panel/Product";

export default function Dashboard() {
  const [activePage, setActivePage] = useState<number>(0);



  const rendererContent = (activePage: number) => {
    switch (activePage) {
      case 0:
        return <Restourant/>;
      case 1:
        return <Category/>;
      case 2:
        return <Product/>;
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
