import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";

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
    ],
    element: <App />,
    path: "/",
  },
]);

export default router;
