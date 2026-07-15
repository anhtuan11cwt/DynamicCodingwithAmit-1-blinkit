import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SearchPage from "../pages/SearchPage";
import VerifyEmail from "../pages/VerifyEmail";

const router = createBrowserRouter([
  {
    children: [
      {
        element: <Home />,
        path: "",
      },
      {
        element: <SearchPage />,
        path: "search",
      },
      {
        element: <Register />,
        path: "register",
      },
      {
        element: <Login />,
        path: "login",
      },
      {
        element: <VerifyEmail />,
        path: "verify-email",
      },
    ],
    element: <App />,
    path: "/",
  },
]);

export default router;
