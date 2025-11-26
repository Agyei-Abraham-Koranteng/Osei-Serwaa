import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { UAParser } from 'ua-parser-js';

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
  contactInfo: { address: string; phone: string; email: string; hours: { weekday: string; weekend: string }; mapUrl?: string };
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface FooterContent {
  copyrightText: string;
  description: string;
  socialLinks: { tiktok: string };
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
  const [categories, setCategories] = useState<Category[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [footerContent, setFooterContentState] = useState<FooterContent>({
    copyrightText: '© 2024 Osei Serwaa Kitchen. All rights reserved.',
    description: 'Authentic Ghanaian cuisine in a modern, elegant setting.',
    socialLinks: { tiktok: '' },
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

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      const { data: catData } = await supabase.from('categories').select('*').order('display_order');
      if (catData) setCategories(catData);

      // Fetch menu items
      const { data: menuData } = await supabase.from('menu_items').select('*');
      if (menuData) {
        setMenuItems(menuData.map(item => ({
          ...item,
          image: item.image_url,
          categoryId: item.category,
          featured: item.featured,
          available: item.available
        })));
      }

      // Fetch visitor count
      const { data: visitorData } = await supabase.from('site_content').select('value').eq('key', 'site_visitors').single();
      if (visitorData?.value) {
        // value is already an object (jsonb)
        setSiteVisitors(visitorData.value.count || 0);
      }

      // Fetch Page Content (Heroes)
      const { data: pageData } = await supabase.from('page_content').select('*');
      if (pageData) {
        const newHeroTexts: Record<string, any> = {};
        const newHeroImages: Record<string, any> = {};
        pageData.forEach(p => {
          newHeroTexts[p.page_slug] = { title: p.hero_title, subtitle: p.hero_subtitle, tagline: p.hero_tagline };
          newHeroImages[p.page_slug] = p.hero_images || [];
        });
        setHeroTextsState(newHeroTexts);
        setHeroImagesState(newHeroImages);
      }

      // Fetch Home Content
      const { data: featuresData } = await supabase.from('home_features').select('*').order('display_order');
      const { data: ctaData } = await supabase.from('home_cta').select('*').single();

      setHomeContentState(prev => ({
        ...prev,
        features: featuresData || [],
        cta: ctaData ? { title: ctaData.title, description: ctaData.description } : { title: '', description: '' },
        hero: heroTexts['home'] as any || prev.hero
      }));

      // Fetch About Content
      const { data: storyData } = await supabase.from('about_story').select('*').single();
      const { data: valuesData } = await supabase.from('about_values').select('*').order('display_order');
      const { data: teamData } = await supabase.from('team_members').select('*').order('display_order');

      setAboutContentState(prev => ({
        ...prev,
        story: storyData ? { paragraph1: storyData.paragraph1, paragraph2: storyData.paragraph2, paragraph3: storyData.paragraph3, images: storyData.images || [] } : prev.story,
        values: valuesData || [],
        team: teamData ? teamData.map(t => ({ ...t, image: t.image_url })) : []
      }));

      // Fetch Gallery Images
      const { data: galleryData } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
      if (galleryData) setGalleryImagesState(galleryData);

      // Fetch Contact Info
      const { data: contactData } = await supabase.from('contact_info').select('*').single();
      setContactPageInfoState(prev => ({
        ...prev,
        contactInfo: contactData ? { address: contactData.address, phone: contactData.phone, email: contactData.email, hours: { weekday: contactData.weekday_hours, weekend: contactData.weekend_hours }, mapUrl: contactData.map_url } : prev.contactInfo,
        pageContent: { heroTitle: heroTexts['contact']?.title || '', heroSubtitle: heroTexts['contact']?.subtitle || '' }
      }));

      // Fetch Footer Info
      const { data: footerData } = await supabase.from('footer_info').select('*').single();
      if (footerData) {
        setFooterContentState({
          copyrightText: footerData.copyright_text,
          description: footerData.description,
          socialLinks: { tiktok: footerData.tiktok_url }
        });
      }
    };

    fetchData();

    // Fetch admin data if authenticated
    const fetchAdminData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: msgData } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (msgData) setContactMessages(msgData.map(m => ({ ...m, createdAt: m.created_at })));

        const { data: resData } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
        if (resData) setReservations(resData.map(r => ({ ...r, createdAt: r.created_at, specialRequests: r.special_requests })));

        const { data: userData } = await supabase.from('profiles').select('*');
        if (userData) setUsers(userData);
      }
    };
    fetchAdminData();

    const savedCart = localStorage.getItem('restaurant-cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const visitors = localStorage.getItem('site-visitors');
    if (visitors) setSiteVisitors(parseInt(visitors, 10));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    try {
      const { image, categoryId, ...rest } = item as any;
      const serverData = { ...rest, image_url: image, category: categoryId };
      const { data, error } = await supabase.from('menu_items').insert([serverData]).select().single();
      if (error) throw error;
      if (data) {
        setMenuItems([...menuItems, { ...data, image: data.image_url, categoryId: data.category }]);
      }
    } catch (err) {
      console.error('Error adding menu item:', err);
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { image, categoryId, ...rest } = updates as any;
      const serverData: any = { ...rest };

      if (image !== undefined) serverData.image_url = image;
      if (categoryId !== undefined) serverData.category = categoryId;

      const { error } = await supabase.from('menu_items').update(serverData).eq('id', id);
      if (error) throw error;
      setMenuItems(menuItems.map(item => (item.id === id ? { ...item, ...updates } : item)));
    } catch (err) {
      console.error('Error updating menu item:', err);
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting menu item:', err);
    }
  };

  // Reservation functions
  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    try {
      const { specialRequests, ...rest } = reservation;
      const dbData = { ...rest, special_requests: specialRequests, status: 'pending' };
      const { data, error } = await supabase.from('reservations').insert([dbData]).select().single();
      if (error) throw error;
      if (data) {
        const newRes = { ...reservation, id: data.id, createdAt: data.created_at, status: 'pending' as const };
        setReservations([newRes, ...reservations]);
      }
    } catch (err) {
      console.error('Error adding reservation:', err);
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
      if (error) throw error;
      setReservations(reservations.map(r => (r.id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error('Error updating reservation:', err);
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) throw error;
      setReservations(reservations.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting reservation:', err);
    }
  };

  // Contact message functions
  const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    try {
      const { data, error } = await supabase.from('messages').insert([message]).select().single();
      if (error) throw error;
      if (data) {
        const newMsg = { ...message, id: data.id, createdAt: data.created_at, status: 'unread' as const };
        setContactMessages([newMsg, ...contactMessages]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const updateContactMessageStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const { error } = await supabase.from('messages').update({ status }).eq('id', id);
      if (error) throw error;
      setContactMessages(contactMessages.map(m => (m.id === id ? { ...m, status } : m)));
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      setContactMessages(contactMessages.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // User Management
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      if (data) {
        setUsers(data as User[]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const addUser = async (user: Omit<User, 'id' | 'created_at'>) => {
    try {
      // 1. Create Auth User (using a temporary client to avoid signing out current admin)
      // Note: This requires the Anon Key to have 'SignUp' enabled.
      // Ideally, this should be done via an Edge Function with Service Role.
      // For this client-side demo, we'll try a workaround or just insert the profile if the user already exists.

      // Workaround: We can't easily create a new auth user without signing out the current one using the standard client.
      // We will assume the user is created via the Supabase Dashboard or a separate flow for now, 
      // OR we can try to use a second client instance.

      const tempSupabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const { data: authData, error: authError } = await tempSupabase.auth.signUp({
        email: user.email,
        password: (user as any).password, // Password passed in
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Insert Profile
        const { error: profileError } = await supabase.from('profiles').insert([{
          id: authData.user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }]);

        if (profileError) throw profileError;

        setUsers([...users, {
          id: authData.user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          created_at: new Date().toISOString()
        }]);
      }
    } catch (err: any) {
      console.error('Error adding user:', err);
      throw err; // Propagate to UI
    }
  };

  const deleteUser = async (id: string) => {
    try {
      // We can only delete the profile via RLS. The Auth user will remain but lose access if logic depends on profile.
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Footer function
  const setFooterContent = async (content: FooterContent) => {
    setFooterContentState(content);
    await supabase.from('footer_info').upsert({
      id: 1,
      copyright_text: content.copyrightText,
      description: content.description,
      tiktok_url: content.socialLinks.tiktok
    });
  };

  // Hero image management
  const setHeroImage = async (page: string, urls: string[]) => {
    const next = { ...heroImages, [page]: urls };
    setHeroImagesState(next);
    await supabase.from('page_content').upsert({
      page_slug: page,
      hero_images: urls
    }, { onConflict: 'page_slug' });
  };

  const setHeroText = async (page: string, payload: { title?: string; subtitle?: string; tagline?: string }) => {
    const next = { ...heroTexts, [page]: payload };
    setHeroTextsState(next);
    await supabase.from('page_content').upsert({
      page_slug: page,
      hero_title: payload.title,
      hero_subtitle: payload.subtitle,
      hero_tagline: payload.tagline
    }, { onConflict: 'page_slug' });
  };

  // Page content setters
  const setHomeContent = async (c: HomeContent) => {
    setHomeContentState(c);

    // Update CTA
    await supabase.from('home_cta').upsert({
      id: 1,
      title: c.cta.title,
      description: c.cta.description
    });

    // Update Features: Wipe and Recreate
    await supabase.from('home_features').delete().neq('id', 0);

    if (c.features.length > 0) {
      const featuresToInsert = c.features.map((f, index) => ({
        title: f.title,
        description: f.description,
        display_order: index + 1
      }));
      await supabase.from('home_features').insert(featuresToInsert);
    }
  };

  const setAboutContent = async (c: AboutContent) => {
    setAboutContentState(c);

    // Update Story
    await supabase.from('about_story').upsert({
      id: 1,
      paragraph1: c.story.paragraph1,
      paragraph2: c.story.paragraph2,
      paragraph3: c.story.paragraph3,
      images: c.story.images
    });

    // Update Values: Wipe and Recreate
    await supabase.from('about_values').delete().neq('id', 0);
    if (c.values.length > 0) {
      const valuesToInsert = c.values.map((v, index) => ({
        title: v.title,
        description: v.description,
        display_order: index + 1
      }));
      await supabase.from('about_values').insert(valuesToInsert);
    }

    // Update Team: Wipe and Recreate
    await supabase.from('team_members').delete().neq('id', 0);
    if (c.team.length > 0) {
      const teamToInsert = c.team.map((t, index) => ({
        name: t.name,
        role: t.role,
        description: t.description,
        image_url: t.image,
        display_order: index + 1
      }));
      await supabase.from('team_members').insert(teamToInsert);
    }
  };

  const setGalleryImages = async (imgs: GalleryImage[]) => {
    setGalleryImagesState(imgs);

    // Update Gallery: Wipe and Recreate
    await supabase.from('gallery_images').delete().neq('id', 0);

    if (imgs.length > 0) {
      const imgsToInsert = imgs.map(img => ({
        src: img.src,
        alt: img.alt,
        category: img.category
      }));
      await supabase.from('gallery_images').insert(imgsToInsert);
    }
  };

  const setContactPageInfo = async (info: ContactPageInfo) => {
    setContactPageInfoState(info);
    await supabase.from('contact_info').upsert({
      id: 1,
      address: info.contactInfo.address,
      phone: info.contactInfo.phone,
      email: info.contactInfo.email,
      weekday_hours: info.contactInfo.hours.weekday,
      weekend_hours: info.contactInfo.hours.weekend,
      map_url: info.contactInfo.mapUrl
    });
  };

  // Site visitor counters
  const incrementSiteVisitors = async () => {
    if (sessionStorage.getItem('visited_session')) return;

    try {
      // Optimistic update for UI
      const newCount = siteVisitors + 1;
      setSiteVisitors(newCount);
      sessionStorage.setItem('visited_session', 'true');

      // Parse User Agent
      const parser = new UAParser();
      const result = parser.getResult();
      const browser = result.browser.name || 'Unknown';
      const deviceType = result.device.type || 'Desktop'; // Default to Desktop if undefined
      const os = result.os.name || 'Unknown';
      const userAgent = result.ua;

      // Call the RPC function to track visit with details
      await supabase.rpc('track_visit', {
        p_user_agent: userAgent,
        p_browser: browser,
        p_device_type: deviceType,
        p_os: os
      });

    } catch (err) {
      console.error('Error incrementing visitors:', err);
    }
  };

  const resetSiteVisitors = async () => {
    try {
      setSiteVisitors(0);
      await supabase.from('site_content').upsert({ key: 'site_visitors', value: JSON.stringify({ count: 0 }) }, { onConflict: 'key' });
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

