import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve __dirname for ESM and compute a sane default database path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use DATABASE_PATH exactly as provided in the environment when present.
// This keeps behavior consistent with the value in `.env.example` (for example `./server/database.sqlite`).
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.sqlite');

// Ensure parent directory exists so SQLite can create the file. We do not rewrite
// relative env paths — we create the directory relative to the current process
// working directory when a relative path is supplied (this matches typical dev setups).
const dbDir = path.dirname(dbPath);
try {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
} catch (e) {
  console.error('Failed to create database directory', dbDir, e && e.message);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database at', dbPath, err.message);
  } else {
    console.log('Connected to the SQLite database at', dbPath);
    initDb();
  }
});

const initDb = () => {
  db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT
    )`);

    // Menu Items Table
    db.run(`CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      category TEXT,
      image_url TEXT,
      available BOOLEAN DEFAULT 1
    )`);

    // Reservations Table
    db.run(`CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      date TEXT,
      time TEXT,
      guests INTEGER,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Contact Messages Table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      subject TEXT,
      message TEXT,
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Site Content Table (Key-Value Store)
    db.run(`CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT
    )`);

    // Uploaded Images Table
    db.run(`CREATE TABLE IF NOT EXISTS uploaded_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      mimetype TEXT,
      data TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

    Object.entries(defaultContent).forEach(([key, value]) => {
      db.run("INSERT OR IGNORE INTO site_content (key, value) VALUES (?, ?)", [key, value]);
    });

    // Seed Admin User
    const adminEmail = 'admin@oseiserwaa.com';
    db.get("SELECT * FROM users WHERE email = ?", [adminEmail], (err, row) => {
      if (!row) {
        const passwordHash = bcrypt.hashSync('admin123', 10);
        db.run("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
          [adminEmail, passwordHash, 'Admin User', 'admin']);
        console.log('Admin user created.');
      }
    });
  });
};

export default db;
