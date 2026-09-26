import { createBrowserRouter, Navigate } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NetWorks from "./pages/NetWorks";
import AdminLayout from "./components/AdminLayout";

import { Private } from "./routes/Private";
import SignUp from "./pages/SignUp";
import LoginLayout from "./components/LoginLayout";
import PageNotFound from "./pages/Error";
import { ValidateUserName } from "./routes/Validate";

export const router = createBrowserRouter([
  {
    path: "/links/:userName",
    element: (
      <ValidateUserName>
        <Home />
      </ValidateUserName>
    ),
  },
  {
    element: <LoginLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },

  {
    element: (
      <Private>
        <AdminLayout />
      </Private>
    ),
    children: [
      {
        path: "/admin/:userName",
        index: true,
        element: <Admin />,
      },
      {
        path: "/admin/social/:userName",
        element: <NetWorks />,
      },
    ],
  },

  {
    path: "*",
    element: <PageNotFound />,
  },
]);
