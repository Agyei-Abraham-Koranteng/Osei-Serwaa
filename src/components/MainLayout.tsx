import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';

const MainLayout = () => {
  const { incrementSiteVisitors } = useRestaurant();

  useEffect(() => {
    // increment simple client-side visitor counter on each page load
    incrementSiteVisitors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
