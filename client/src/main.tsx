import { createRoot } from "react-dom/client";
import "./styles/index.css";
import Router from "./routers/router";
import ImageProvider from "./providers/image-provider";
import UserProvider from "./providers/user-provider";
createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <ImageProvider>
      <Router />
    </ImageProvider>
  </UserProvider>
);
