import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";

export default function RootLayout() {
  const location = useLocation();

  // Routes where we don't want to show the navbar
  const noNavbarRoutes = ["/waitlist"];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
    </>
  );
}
