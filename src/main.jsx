import "./index.css";

import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React from "react";
import ReactDOM from "react-dom/client";

import Caho from "./Caho.jsx";

import Onspot from "./Onspot.jsx";
import KitDisposal from "./KitDisposal.jsx";
import Home from "./Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  // {
  //   path: "/onspot",
  //   element: <Onspot />,
  // },
  {
    path: "/kitdisposal",
    element: <KitDisposal />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
