import pg from 'pg';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper to run queries
const query = (text, params) => pool.query(text, params);

const initDb = async () => {
  try {
    // Users Table
    await query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT
    )`);

    // Menu Items Table
    await query(`CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name TEXT,
      description TEXT,
      price REAL,
      category TEXT,
      image_url TEXT,
      available BOOLEAN DEFAULT true,
      featured BOOLEAN DEFAULT false
    )`);

    // Categories Table (Missing in previous schema but used in index.js)
    await query(`CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      display_order INTEGER DEFAULT 99
    )`);

    // Reservations Table
    await query(`CREATE TABLE IF NOT EXISTS reservations (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      date TEXT,
      time TEXT,
      guests INTEGER,
      special_requests TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Contact Messages Table
    await query(`CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      subject TEXT,
      message TEXT,
      status TEXT DEFAULT 'unread',
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Site Content Table (Key-Value Store)
    await query(`CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT
    )`);

    // Uploaded Images Table
    await query(`CREATE TABLE IF NOT EXISTS uploaded_images (
      id SERIAL PRIMARY KEY,
      filename TEXT,
      mimetype TEXT,
      data TEXT,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed Default Content
    const defaultContent = {
      'home_content': JSON.stringify({
        hero: {
          title: 'Osei Serwaa Kitchen',
          subtitle: 'Authentic West African Cuisine',
          tagline: 'Experience the rich flavors and traditions of Ghana in every dish',
        },
        features: [
          { title: 'Award Winning', description: 'Recognized for excellence in authentic cuisine' },
          { title: 'Quality Ingredients', description: 'Fresh, locally sourced ingredients daily' },
          { title: 'Fast Service', description: 'Quick preparation without compromising quality' },
          { title: 'Made with Love', description: 'Every dish prepared with care and passion' },
        ],
        cta: {
          title: 'Ready to Experience True Ghanaian Flavors?',
          description: 'Book a table and come experience the best of authentic Ghanaian cuisine.',
        },
      }),
      'about_content': JSON.stringify({
        story: {
          paragraph1: "Sharing Ghana's rich culinary heritage, inspired by our founder's grandmother, Osei Serwaa.",
          paragraph2: "Every dish we serve is prepared using traditional methods and authentic ingredients, ensuring that each bite transports you to the vibrant streets and warm kitchens of Ghana. From our signature jollof rice to our perfectly seasoned banku, we take pride in maintaining the authentic flavors that have made Ghanaian cuisine beloved worldwide.",
          paragraph3: "Our commitment to quality, authenticity, and excellent service has made us a favorite destination for those seeking genuine Ghanaian food. Whether you're from Ghana or discovering these flavors for the first time, we invite you to experience the warmth and hospitality that define our kitchen.",
        },
        values: [
          { title: 'Authenticity', description: 'We stay true to traditional recipes and cooking methods' },
          { title: 'Quality', description: 'Only the freshest ingredients make it to your plate' },
          { title: 'Community', description: 'We bring people together through food and culture' },
          { title: 'Excellence', description: 'Every dish is prepared with care and passion' },
        ],
        team: [
          { name: 'Kwame Osei', role: 'Head Chef', description: 'With 20 years of experience in traditional Ghanaian cooking', image: '' },
          { name: 'Akosua Mensah', role: 'Restaurant Manager', description: 'Ensuring every guest feels at home in our kitchen', image: '' },
          { name: 'Kofi Asante', role: 'Sous Chef', description: 'Bringing innovation while respecting tradition', image: '' },
        ],
      }),
      'contact_page': JSON.stringify({
        pageContent: {
          heroTitle: 'Contact Us',
          heroSubtitle: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
        },
        contactInfo: {
          address: '123 Liberation Road\nAccra, Ghana',
          phone: '+233 24 750 5196',
          email: 'hello@oseiserwaa.com',
          hours: { weekday: 'Mon - Fri: 11:00 AM - 10:00 PM', weekend: 'Sat - Sun: 10:00 AM - 11:00 PM' },
        },
      }),
      'gallery_images': JSON.stringify([]),
      'hero_images': JSON.stringify({}),
      'hero_texts': JSON.stringify({
        home: {
          title: 'Osei Serwaa Kitchen',
          subtitle: 'Authentic West African Cuisine',
          tagline: 'Experience the rich flavors and traditions of Ghana in every dish'
        },
        about: {
          title: 'About Us',
          subtitle: '',
          tagline: ''
        },
        contact: {
          title: 'Contact Us',
          subtitle: "Have questions? We'd love to hear from you.",
          tagline: ''
        }
      })
    };

    for (const [key, value] of Object.entries(defaultContent)) {
      await query("INSERT INTO site_content (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING", [key, value]);
    }

    // Seed Admin User
    const adminEmail = 'admin@oseiserwaa.com';
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [adminEmail]);
    if (rows.length === 0) {
      const passwordHash = bcrypt.hashSync('admin123', 10);
      await query("INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)",
        [adminEmail, passwordHash, 'Admin User', 'admin']);
      console.log('Admin user created.');
    }

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Initialize DB on start
initDb();

export default {
  query,
  pool
};
