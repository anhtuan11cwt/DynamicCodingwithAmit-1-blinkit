import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";

const router = createBrowserRouter([
  {
    children: [
      {
        element: <Home />,
        path: "",
      },
    ],
    element: <App />,
    path: "/",
  },
]);

export default router;
