import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "@/context/RestaurantContext";
import { AuthProvider } from "@/context/AuthContext";

// Layouts
import MainLayout from "@/components/MainLayout";
import AdminLayout from "@/pages/admin/AdminLayout";

// User Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Reservations from "./pages/Reservations";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Orders from "./pages/Orders";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import HomeContentManagement from "./pages/admin/HomeContentManagement";
import MenuManagement from "./pages/admin/MenuManagement";
import AboutContentManagement from "./pages/admin/AboutContentManagement";
import ReservationManagement from "./pages/admin/ReservationManagement";
import GalleryManagement from "./pages/admin/GalleryManagement";
import ContactInfoManagement from "./pages/admin/ContactInfoManagement";
import ContactMessagesManagement from "./pages/admin/ContactMessagesManagement";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RestaurantProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* User Routes with Main Layout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/orders" element={<Orders />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="home" element={<HomeContentManagement />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="about" element={<AboutContentManagement />} />
                <Route path="reservations" element={<ReservationManagement />} />
                <Route path="gallery" element={<GalleryManagement />} />
                <Route path="contact" element={<ContactInfoManagement />} />
                <Route path="contact-messages" element={<ContactMessagesManagement />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RestaurantProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
