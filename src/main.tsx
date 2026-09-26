import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ToastContainer } from "react-toastify";
import UserProvider from "./contexts/user";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
);
