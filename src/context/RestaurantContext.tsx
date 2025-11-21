import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import menuDataJson from '@/data/menuData.json';
import ordersDataJson from '@/data/mockOrders.json';
import reservationsDataJson from '@/data/mockReservations.json';

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

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  deliveryAddress: string;
  orderDate: string;
  deliveryType: 'delivery' | 'pickup';
  notes: string;
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
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
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
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  
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
  // Load initial data from JSON files
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuDataJson.menuItems as MenuItem[]);
  const [categories] = useState<Category[]>(menuDataJson.categories as Category[]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(ordersDataJson.orders as Order[]);
  const [reservations, setReservations] = useState<Reservation[]>(
    reservationsDataJson.reservations as Reservation[]
  );
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('restaurant-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('restaurant-cart', JSON.stringify(cart));
  }, [cart]);

  // Menu functions
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  // Cart functions
  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      updateCartQuantity(item.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Order functions
  const addOrder = (order: Omit<Order, 'id' | 'orderDate'>) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
    };
    setOrders([newOrder, ...orders]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status } : order
    ));
  };

  // Reservation functions
  const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: `RES-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReservations([newReservation, ...reservations]);
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations(reservations.map(reservation => 
      reservation.id === id ? { ...reservation, status } : reservation
    ));
  };

  const deleteReservation = (id: string) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
  };

  // Contact Message functions
  const addContactMessage = (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const newMessage: ContactMessage = {
      ...message,
      id: `MSG-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    setContactMessages([newMessage, ...contactMessages]);
  };

  const updateContactMessageStatus = (id: string, status: ContactMessage['status']) => {
    setContactMessages(contactMessages.map(message => 
      message.id === id ? { ...message, status } : message
    ));
  };

  const deleteContactMessage = (id: string) => {
    setContactMessages(contactMessages.filter(message => message.id !== id));
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
    orders,
    addOrder,
    updateOrderStatus,
    reservations,
    addReservation,
    updateReservationStatus,
    deleteReservation,
    contactMessages,
    addContactMessage,
    updateContactMessageStatus,
    deleteContactMessage,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};
