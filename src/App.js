import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Layouts/RootLayout";
import Home from "./components/Home";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import SellItem from "./components/SellItem";
import NotFound from "./components/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import LanguageProvider from "./contexts/LanguageContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import Catalog from "./components/Catalog";
import Waitlist from "./components/Waitlist";
import About from "./components/About";
import Login from "./components/Login";

// Check if we're in waitlist-only mode
const isWaitlistOnly = process.env.REACT_APP_WAITLIST_ONLY === "true";

const router = createBrowserRouter([
  // If waitlist-only mode, redirect everything to waitlist
  ...(isWaitlistOnly
    ? [
        {
          path: "*", // Catch all routes
          element: <Waitlist />,
        },
      ]
    : [
        // Normal app routes (when not in waitlist mode)
        {
          path: "/",
          element: <RootLayout />,
          errorElement: <NotFound />,
          children: [
            { index: true, element: <Home /> },
            { path: "products", element: <Products /> },
            { path: "products/:id", element: <ProductDetail /> },
            { path: "waitlist", element: <Waitlist /> },
            { path: "about", element: <About /> },
            {
              path: "login",
              element: <Login />,
            },
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
      ]),
]);

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
