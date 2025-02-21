import { createRoot } from "react-dom/client";
import "./styles/index.css";
import Router from "./routers/router";
import ImageProvider from "./providers/image-provider";
createRoot(document.getElementById("root")!).render(
  <ImageProvider>
    <Router />
  </ImageProvider>
);
