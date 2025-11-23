import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

// Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId: string;
  image: string;
  featured: boolean;
  available: boolean;
  spicyLevel: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface HomeContent {
  hero: { title: string; subtitle: string; tagline: string };
  features: { title: string; description: string }[];
  cta: { title: string; description: string };
}

export interface AboutContent {
  story: { paragraph1: string; paragraph2: string; paragraph3: string; images: string[] };
  values: { title: string; description: string }[];
  team: { name: string; role: string; description: string; image: string }[];
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

export interface ContactPageInfo {
  pageContent: { heroTitle: string; heroSubtitle: string };
  contactInfo: { address: string; phone: string; email: string; hours: { weekday: string; weekend: string } };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface FooterContent {
  copyrightText: string;
  description: string;
  socialLinks: { facebook: string; instagram: string; twitter: string };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

interface RestaurantContextType {
  // Menu
  menuItems: MenuItem[];
  categories: Category[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Reservations
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  deleteReservation: (id: string) => void;

  // Contact Messages
  contactMessages: ContactMessage[];
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
  updateContactMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteContactMessage: (id: string) => void;

  // Users
  users: User[];
  addUser: (user: Omit<User, 'id' | 'created_at'>) => void;
  deleteUser: (id: string) => void;

  // Footer
  footerContent: FooterContent;
  setFooterContent: (content: FooterContent) => void;

  // Hero images (array per page)
  heroImages: Record<string, string[]>;
  setHeroImage: (page: string, urls: string[]) => Promise<void>;

  // Hero texts
  heroTexts: Record<string, { title?: string; subtitle?: string; tagline?: string }>;
  setHeroText: (page: string, payload: { title?: string; subtitle?: string; tagline?: string }) => Promise<void>;

  // Page content
  homeContent: HomeContent;
  setHomeContent: (c: HomeContent) => void;
  aboutContent: AboutContent;
  setAboutContent: (c: AboutContent) => void;
  galleryImages: GalleryImage[];
  setGalleryImages: (imgs: GalleryImage[]) => void;
  contactPageInfo: ContactPageInfo;
  setContactPageInfo: (info: ContactPageInfo) => void;

  // Site visitors counter
  siteVisitors: number;
  incrementSiteVisitors: () => void;
  resetSiteVisitors: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
};

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  // Core state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories] = useState<Category[]>([
    { id: 'starters', name: 'Starters', description: 'Light bites to start your meal' },
    { id: 'mains', name: 'Main Courses', description: 'Hearty traditional dishes' },
    { id: 'sides', name: 'Sides', description: 'Perfect accompaniments' },
    { id: 'drinks', name: 'Drinks', description: 'Refreshing beverages' },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [footerContent, setFooterContentState] = useState<FooterContent>({
    copyrightText: '© 2024 Osei Serwaa Kitchen. All rights reserved.',
    description: 'Authentic Ghanaian cuisine in a modern, elegant setting.',
    socialLinks: { facebook: '', instagram: '', twitter: '' },
  });

  const [heroImages, setHeroImagesState] = useState<Record<string, string[]>>({});
  const [heroTexts, setHeroTextsState] = useState<Record<string, { title?: string; subtitle?: string; tagline?: string }>>({});

  const [homeContent, setHomeContentState] = useState<HomeContent>({
    hero: { title: 'Osei Serwaa Kitchen', subtitle: 'Authentic West African Cuisine', tagline: 'Experience the rich flavors and traditions of Ghana in every dish' },
    features: [],
    cta: { title: '', description: '' },
  });

  const [aboutContent, setAboutContentState] = useState<AboutContent>({
    story: { paragraph1: '', paragraph2: '', paragraph3: '', images: [] },
    values: [],
    team: [],
  });

  const [galleryImages, setGalleryImagesState] = useState<GalleryImage[]>([]);

  const [contactPageInfo, setContactPageInfoState] = useState<ContactPageInfo>({
    pageContent: { heroTitle: '', heroSubtitle: '' },
    contactInfo: { address: '', phone: '', email: '', hours: { weekday: '', weekend: '' } },
  });

  const [siteVisitors, setSiteVisitors] = useState<number>(0);

  // Helper to persist generic content
  const saveContent = async (key: string, value: any) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/content/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(value),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }
    } catch (err) {
      console.error(`Error saving content for ${key}:`, err);
      throw err; // Re-throw to let caller handle it
    }
  };

  // Initial data fetch
  useEffect(() => {
    // Fetch menu items
    fetch(`${API_URL}/api/menu`)
      .then(r => r.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error('Error fetching menu:', err));

    // Fetch visitor count
    fetch(`${API_URL}/api/visitors`)
      .then(r => r.json())
      .then(data => setSiteVisitors(data.count))
      .catch(err => console.error('Error fetching visitors:', err));

    // Fetch contact messages and reservations (admin only)
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Fetch contact messages
      fetch(`${API_URL}/api/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => setContactMessages(data))
        .catch(err => console.error('Error fetching messages:', err));

      // Fetch reservations
      fetch(`${API_URL}/api/reservations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => setReservations(data))
        .catch(err => console.error('Error fetching reservations:', err));

      // Fetch users
      fetch(`${API_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(r => {
          if (!r.ok) throw new Error('Failed to fetch users');
          return r.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            console.error('Expected array of users, got:', data);
            setUsers([]);
          }
        })
        .catch(err => {
          console.error('Error fetching users:', err);
          setUsers([]);
        });
    }

    // Other site content
    const fetchContent = async () => {
      try {
        const [home, about, contact, gallery, heroImgs, heroTxts, footer] = await Promise.all([
          fetch(`${API_URL}/api/content/home_content`).then(r => r.json()),
          fetch(`${API_URL}/api/content/about_content`).then(r => r.json()),
          fetch(`${API_URL}/api/content/contact_page`).then(r => r.json()),
          fetch(`${API_URL}/api/content/gallery_images`).then(r => r.json()),
          fetch(`${API_URL}/api/content/hero_images`).then(r => r.json()),
          fetch(`${API_URL}/api/content/hero_texts`).then(r => r.json()),
          fetch(`${API_URL}/api/content/footer`).then(r => r.json()),
        ]);
        if (home) setHomeContentState(home);
        if (about) setAboutContentState(about);
        if (contact) setContactPageInfoState(contact);
        if (gallery) setGalleryImagesState(gallery);
        if (heroImgs) setHeroImagesState(heroImgs);
        if (heroTxts) setHeroTextsState(heroTxts);
        if (footer) setFooterContentState(footer);
      } catch (err) {
        console.error('Error fetching site content:', err);
      }
    };
    fetchContent();

    // Load cart from localStorage
    const savedCart = localStorage.getItem('restaurant-cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    // Load site visitors counter
    const visitors = localStorage.getItem('site-visitors');
    if (visitors) setSiteVisitors(parseInt(visitors, 10));
  }, []);

  // Persist cart changes
  useEffect(() => {
    localStorage.setItem('restaurant-cart', JSON.stringify(cart));
  }, [cart]);

  // Cart functions
  const addToCart = (item: MenuItem) => {
    const existing = cart.find(ci => ci.id === item.id);
    if (existing) {
      updateCartQuantity(item.id, existing.quantity + 1);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => setCart(cart.filter(item => item.id !== id));

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Menu functions
  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      // Map 'image' to 'image_url' for server compatibility
      const { image, ...rest } = item as any;
      const serverData = { ...rest, image_url: image };

      const res = await fetch(`${API_URL}/api/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(serverData),
      });
      if (res.ok) {
        const newItem = await res.json();
        setMenuItems([...menuItems, newItem]);
      }
    } catch (err) {
      console.error('Error adding menu item:', err);
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      // Map 'image' to 'image_url' for server compatibility
      const { image, ...rest } = updates as any;
      const serverData = image !== undefined ? { ...rest, image_url: image } : rest;

      const res = await fetch(`${API_URL}/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(serverData),
      });
      if (res.ok) {
        setMenuItems(menuItems.map(item => (item.id === id ? { ...item, ...updates } : item)));
      }
    } catch (err) {
      console.error('Error updating menu item:', err);
    }
  };

  const deleteMenuItem = async (id: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting menu item:', err);
    }
  };

  // Reservation functions
  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation),
      });
      if (res.ok) {
        const data = await res.json();
        const newRes = { ...reservation, id: data.id, createdAt: new Date().toISOString(), status: 'pending' as const };
        setReservations([newRes, ...reservations]);
      }
    } catch (err) {
      console.error('Error adding reservation:', err);
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReservations(reservations.map(r => (r.id === id ? { ...r, status } : r)));
      }
    } catch (err) {
      console.error('Error updating reservation:', err);
    }
  };

  const deleteReservation = async (id: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setReservations(reservations.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Error deleting reservation:', err);
    }
  };

  // Contact message functions
  const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      if (res.ok) {
        const data = await res.json();
        const newMsg = { ...message, id: data.id, createdAt: new Date().toISOString(), status: 'unread' as const };
        setContactMessages([newMsg, ...contactMessages]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const updateContactMessageStatus = async (id: string, status: ContactMessage['status']) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/messages/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setContactMessages(contactMessages.map(m => (m.id === id ? { ...m, status } : m)));
      }
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  const deleteContactMessage = async (id: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setContactMessages(contactMessages.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // User Management
  const addUser = async (user: Omit<User, 'id' | 'created_at'>) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        const newUser = await res.json();
        setUsers([...users, newUser]);
      }
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const deleteUser = async (id: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Footer function
  const setFooterContent = (content: FooterContent) => {
    setFooterContentState(content);
    saveContent('footer', content);
  };

  // Hero image management
  const setHeroImage = async (page: string, urls: string[]) => {
    const next = { ...heroImages, [page]: urls };
    setHeroImagesState(next);
    await saveContent('hero_images', next);
  };

  const setHeroText = async (page: string, payload: { title?: string; subtitle?: string; tagline?: string }) => {
    const next = { ...heroTexts, [page]: payload };
    setHeroTextsState(next);
    await saveContent('hero_texts', next);
  };

  // Page content setters
  const setHomeContent = (c: HomeContent) => {
    setHomeContentState(c);
    saveContent('home_content', c);
  };

  const setAboutContent = (c: AboutContent) => {
    setAboutContentState(c);
    saveContent('about_content', c);
  };

  const setGalleryImages = (imgs: GalleryImage[]) => {
    setGalleryImagesState(imgs);
    saveContent('gallery_images', imgs);
  };

  const setContactPageInfo = (info: ContactPageInfo) => {
    setContactPageInfoState(info);
    saveContent('contact_page', info);
  };

  // Site visitor counters
  // Site visitor counters
  const incrementSiteVisitors = async () => {
    // Check if we already counted this session
    if (sessionStorage.getItem('visited_session')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/visitors/increment`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSiteVisitors(data.count);
        sessionStorage.setItem('visited_session', 'true');
      }
    } catch (err) {
      console.error('Error incrementing visitors:', err);
    }
  };

  const resetSiteVisitors = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/visitors/reset`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSiteVisitors(0);
      }

    } catch (err) {
      console.error('Error resetting visitors:', err);
    }
  };

  const value: RestaurantContextType = {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    reservations,
    addReservation,
    updateReservationStatus,
    deleteReservation,
    contactMessages,
    addContactMessage,
    updateContactMessageStatus,
    deleteContactMessage,
    users,
    addUser,
    deleteUser,
    footerContent,
    setFooterContent,
    heroImages,
    setHeroImage,
    heroTexts,
    setHeroText,
    homeContent,
    setHomeContent,
    aboutContent,
    setAboutContent,
    galleryImages,
    setGalleryImages,
    contactPageInfo,
    setContactPageInfo,
    siteVisitors,
    incrementSiteVisitors,
    resetSiteVisitors,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

