import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Prefer setting SECRET_KEY in environment for production

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only image files are allowed!'), false);
            return;
        }
        cb(null, true);
    }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build when in production (optional)
if (process.env.NODE_ENV === 'production') {
    const clientDist = path.join(__dirname, '..', 'dist');
    const indexFile = path.join(clientDist, 'index.html');

    if (fs.existsSync(indexFile)) {
        app.use(express.static(clientDist));
        app.get('*', (req, res) => {
            // API routes should not be handled by this catch-all
            if (req.path.startsWith('/api')) {
                return res.status(404).json({ error: 'API endpoint not found' });
            }
            res.sendFile(indexFile);
        });
    } else {
        console.warn(`Production build not found at ${indexFile}. Skipping static file serving.`);
    }
}

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Auth Routes ---

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = rows[0];

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- User Management Routes ---

app.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const { rows } = await db.query("SELECT id, name, email, role FROM users");
        const mappedRows = rows.map(row => ({
            id: row.id.toString(),
            name: row.name,
            email: row.email,
            role: row.role,
            created_at: new Date().toISOString()
        }));
        res.json(mappedRows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', authenticateToken, async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        const { rows } = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
            [name, email, passwordHash, role || 'admin']
        );
        res.json({ id: rows[0].id.toString(), name, email, role, created_at: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        await db.query("DELETE FROM users WHERE id = $1", [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Category Routes ---

app.get('/api/categories', async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM categories ORDER BY display_order ASC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
    const { id, name, description, display_order } = req.body;
    const catId = id || name.toLowerCase().replace(/\s+/g, '-');

    try {
        await db.query(
            "INSERT INTO categories (id, name, description, display_order) VALUES ($1, $2, $3, $4)",
            [catId, name, description, display_order || 99]
        );
        res.json({ id: catId, name, description, display_order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/categories/:id', authenticateToken, async (req, res) => {
    const { name, description, display_order } = req.body;
    try {
        await db.query(
            "UPDATE categories SET name = $1, description = $2, display_order = $3 WHERE id = $4",
            [name, description, display_order, req.params.id]
        );
        res.json({ message: 'Category updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
    try {
        await db.query("DELETE FROM categories WHERE id = $1", [req.params.id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Menu Routes ---

app.get('/api/menu', async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM menu_items");
        const mappedRows = rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            category: row.category,
            categoryId: row.category,
            image: row.image_url || row.image,
            featured: Boolean(row.featured),
            available: Boolean(row.available),
            spicyLevel: row.spicyLevel || 0
        }));
        res.json(mappedRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/menu', authenticateToken, async (req, res) => {
    const { name, description, price, category, image_url, featured, available } = req.body;
    try {
        const { rows } = await db.query(
            "INSERT INTO menu_items (name, description, price, category, image_url, featured, available) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
            [name, description, price, category, image_url, featured ? true : false, available ? true : false]
        );
        res.json({ id: rows[0].id, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/menu/:id', authenticateToken, async (req, res) => {
    const { name, description, price, category, image_url, available, featured } = req.body;
    try {
        await db.query(
            "UPDATE menu_items SET name = $1, description = $2, price = $3, category = $4, image_url = $5, available = $6, featured = $7 WHERE id = $8",
            [name, description, price, category, image_url, available ? true : false, featured ? true : false, req.params.id]
        );
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/menu/:id', authenticateToken, async (req, res) => {
    try {
        await db.query("DELETE FROM menu_items WHERE id = $1", [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Reservation Routes ---

app.post('/api/reservations', async (req, res) => {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;
    try {
        const { rows } = await db.query(
            "INSERT INTO reservations (name, email, phone, date, time, guests, special_requests) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
            [name, email, phone, date, time, guests, specialRequests || '']
        );
        res.json({ id: rows[0].id, message: 'Reservation created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reservations', authenticateToken, async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM reservations ORDER BY created_at DESC");
        const mappedRows = rows.map(row => ({
            id: row.id.toString(),
            name: row.name,
            email: row.email,
            phone: row.phone,
            date: row.date,
            time: row.time,
            guests: row.guests,
            specialRequests: row.special_requests,
            status: row.status || 'pending',
            createdAt: row.created_at
        }));
        res.json(mappedRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/reservations/:id/status', authenticateToken, async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE reservations SET status = $1 WHERE id = $2", [status, req.params.id]);
        res.json({ message: 'Reservation status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/reservations/:id', authenticateToken, async (req, res) => {
    try {
        await db.query("DELETE FROM reservations WHERE id = $1", [req.params.id]);
        res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Contact Messages Routes ---

app.post('/api/messages', async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const { rows } = await db.query(
            "INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id",
            [name, email, subject, message]
        );
        res.json({ id: rows[0].id, message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/messages', authenticateToken, async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM messages ORDER BY created_at DESC");
        const mappedRows = rows.map(row => ({
            id: row.id.toString(),
            name: row.name,
            email: row.email,
            subject: row.subject,
            message: row.message,
            status: row.status || (row.read ? 'read' : 'unread'),
            createdAt: row.created_at
        }));
        res.json(mappedRows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/messages/:id/status', authenticateToken, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        await db.query("UPDATE messages SET status = $1 WHERE id = $2", [status, req.params.id]);
        res.json({ message: 'Status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/messages/:id', authenticateToken, async (req, res) => {
    try {
        await db.query("DELETE FROM messages WHERE id = $1", [req.params.id]);
        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Visitor Counter Routes ---

app.get('/api/visitors', async (req, res) => {
    try {
        const { rows } = await db.query("SELECT value FROM site_content WHERE key = 'site_visitors'");
        const count = rows[0] ? JSON.parse(rows[0].value).count : 0;
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/visitors/increment', async (req, res) => {
    try {
        const { rows } = await db.query("SELECT value FROM site_content WHERE key = 'site_visitors'");
        let count = 0;
        if (rows[0]) {
            try { count = JSON.parse(rows[0].value).count; } catch (e) { }
        }

        count += 1;
        const value = JSON.stringify({ count });

        await db.query(
            "INSERT INTO site_content (key, value) VALUES ('site_visitors', $1) ON CONFLICT(key) DO UPDATE SET value = $2",
            [value, value]
        );
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/visitors/reset', authenticateToken, async (req, res) => {
    const value = JSON.stringify({ count: 0 });
    try {
        await db.query(
            "INSERT INTO site_content (key, value) VALUES ('site_visitors', $1) ON CONFLICT(key) DO UPDATE SET value = $2",
            [value, value]
        );
        res.json({ count: 0, message: 'Visitor count reset' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Site Content Routes ---

app.get('/api/content/:key', async (req, res) => {
    try {
        const { rows } = await db.query("SELECT value FROM site_content WHERE key = $1", [req.params.key]);
        if (!rows[0]) return res.json(null);
        try {
            res.json(JSON.parse(rows[0].value));
        } catch (e) {
            res.json(rows[0].value);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/content/:key', authenticateToken, async (req, res) => {
    const { key } = req.params;
    const value = JSON.stringify(req.body);

    console.log(`Saving content for key: ${key}, Size: ${(value.length / 1024 / 1024).toFixed(2)} MB`);

    try {
        await db.query(
            "INSERT INTO site_content (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = $3",
            [key, value, value]
        );
        res.json({ message: 'Content updated' });
    } catch (err) {
        console.error(`Database error saving ${key}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// --- Image Upload Routes ---

app.post('/api/upload/image', authenticateToken, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    const { originalname, mimetype, buffer } = req.file;
    const base64Data = buffer.toString('base64');

    try {
        const { rows } = await db.query(
            "INSERT INTO uploaded_images (filename, mimetype, data) VALUES ($1, $2, $3) RETURNING id",
            [originalname, mimetype, base64Data]
        );
        res.json({
            id: rows[0].id,
            filename: originalname,
            url: `/api/images/${rows[0].id}`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/images/:id', async (req, res) => {
    try {
        const { rows } = await db.query("SELECT * FROM uploaded_images WHERE id = $1", [req.params.id]);
        if (!rows[0]) return res.status(404).json({ error: 'Image not found' });

        // Return as data URL
        const dataUrl = `data:${rows[0].mimetype};base64,${rows[0].data}`;
        res.json({ id: rows[0].id, filename: rows[0].filename, dataUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/images/:id', authenticateToken, async (req, res) => {
    try {
        await db.query("DELETE FROM uploaded_images WHERE id = $1", [req.params.id]);
        res.json({ message: 'Image deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!process.env.SECRET_KEY) {
        console.warn('WARNING: using default SECRET_KEY. Set SECRET_KEY environment variable in production.');
    }
});
