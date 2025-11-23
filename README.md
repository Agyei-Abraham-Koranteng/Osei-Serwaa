# Osei Serwaa Kitchen

A modern, full-stack restaurant management system for authentic Ghanaian cuisine, featuring a beautiful public-facing website and comprehensive admin portal.

## 🌟 Features

### Public Website
- **Home Page**: Engaging hero section with featured dishes and restaurant highlights
- **Menu**: Browse authentic Ghanaian dishes organized by categories
- **About**: Learn about our story, values, and team
- **Contact**: Get in touch with location, hours, and contact form
- **Reservations**: Easy online table booking system

### Admin Portal
- **Dashboard**: Overview of reservations, messages, and site analytics
- **Menu Management**: Add, edit, and manage menu items with images
- **Category Management**: Organize menu categories
- **Reservations**: View and manage table bookings with status tracking
- **Contact Messages**: Handle customer inquiries with status filters
- **About Page Management**: Update story, values, and team information
- **User Management**: Manage admin users and permissions
- **CSV Export**: Download reservations and messages data

## 🚀 Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful UI components
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **SQLite** database for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for image uploads

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Agyei-Abraham-Koranteng/Osei-Serwaa.git
cd Osei-Serwaa
```

### 2. Install dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 3. Start the development servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```

The frontend will run on `http://localhost:8080` and the backend on `http://localhost:3001`.

## 🔐 Admin Access

Default admin credentials:
- **Email**: admin@oseiserwaa.com
- **Password**: admin123

⚠️ **Important**: Change these credentials in production!

## 📁 Project Structure

```
osei-serwaa-kitchen-app/
├── src/                      # Frontend source code
│   ├── components/          # Reusable React components
│   │   ├── admin/          # Admin-specific components
│   │   └── ui/             # shadcn/ui components
│   ├── context/            # React Context (RestaurantContext)
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin portal pages
│   │   └── public pages    # Public website pages
│   ├── utils/              # Utility functions
│   └── App.tsx             # Main app component
├── server/                  # Backend source code
│   ├── index.js            # Express server
│   ├── db.js               # Database initialization
│   └── database.sqlite     # SQLite database file
└── public/                  # Static assets
```

## 🗄️ Database Schema

The SQLite database includes tables for:
- **users**: Admin users with authentication
- **menu_items**: Restaurant menu items
- **reservations**: Table bookings
- **messages**: Contact form submissions
- **site_content**: Page content (JSON stored as text)
- **uploaded_images**: Base64 encoded images

## 🎨 Customization

### Update Restaurant Information
Edit the default content in `server/db.js` to customize:
- Restaurant name and description
- Contact information
- Business hours
- About page content

### Styling
- Main theme colors are defined in `src/index.css`
- Tailwind configuration in `tailwind.config.ts`
- Component styles use Tailwind utility classes

## 📦 Building for Production

### Frontend
```bash
npm run build
```

### Backend
The backend runs as-is in production. Ensure you:
1. Set proper environment variables
2. Use a production-grade database
3. Enable HTTPS
4. Update CORS settings

## 🔒 Security Notes

- Change default admin credentials
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Enable HTTPS in production
- Regularly update dependencies

## 📝 License

This project is private and proprietary.

## 👥 Contact

For questions or support, contact: hello@oseiserwaa.com

---

Built with ❤️ for authentic Ghanaian cuisine
