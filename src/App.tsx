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

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import HomeManagement from "./pages/admin/HomeManagement";
import MenuManagement from "./pages/admin/MenuManagement";
import AboutManagement from "./pages/admin/AboutManagement";
import ReservationsManagement from "./pages/admin/ReservationsManagement";
import GalleryManagement from "./pages/admin/GalleryManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import FooterManagement from "./pages/admin/FooterManagement";
import SiteVisitors from "./pages/admin/SiteVisitors";
import ManageAdmins from "./pages/admin/ManageAdmins";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import ScrollToTop from "@/components/ScrollToTop";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RestaurantProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Routes>
              {/* User Routes with Main Layout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="home" element={<HomeManagement />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="about" element={<AboutManagement />} />
                <Route path="reservations" element={<ReservationsManagement />} />
                <Route path="gallery" element={<GalleryManagement />} />
                <Route path="contact" element={<ContactManagement />} />
                <Route path="footer" element={<FooterManagement />} />
                <Route path="visitors" element={<SiteVisitors />} />
                <Route path="manage-admins" element={<ManageAdmins />} />
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
