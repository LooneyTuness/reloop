import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Layouts/RootLayout";
import Home from "./components/Home";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import SellItem from "./components/SellItem";
import NotFound from "./components/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import Catalog from "./components/Catalog";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },
      {
        path: "sell",
        element: (
          <ProtectedRoute>
            <SellItem />
          </ProtectedRoute>
        ),
      },
      {
        path: "catalog",
        element: (
          <ProtectedRoute>
            <Catalog />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
