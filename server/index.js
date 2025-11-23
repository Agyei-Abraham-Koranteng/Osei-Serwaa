import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
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
    app.use(express.static(clientDist));
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientDist, 'index.html'));
    });
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

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    });
});

// --- User Management Routes ---

app.get('/api/users', authenticateToken, (req, res) => {
    console.log('Fetching users...');
    db.all("SELECT id, name, email, role FROM users", [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: err.message });
        }
        const mappedRows = rows.map(row => ({
            id: row.id.toString(),
            name: row.name,
            email: row.email,
            role: row.role,
            created_at: new Date().toISOString() // We don't have created_at in schema yet, but context expects it
        }));
        res.json(mappedRows);
    });
});

app.post('/api/users', authenticateToken, (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, passwordHash, role || 'admin'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID.toString(), name, email, role, created_at: new Date().toISOString() });
        }
    );
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User deleted successfully' });
    });
});

// --- Category Routes ---

app.get('/api/categories', (req, res) => {
    db.all("SELECT * FROM categories ORDER BY display_order ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/categories', authenticateToken, (req, res) => {
    const { id, name, description, display_order } = req.body;
    const catId = id || name.toLowerCase().replace(/\s+/g, '-');

    db.run("INSERT INTO categories (id, name, description, display_order) VALUES (?, ?, ?, ?)",
        [catId, name, description, display_order || 99],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: catId, name, description, display_order });
        }
    );
});

app.put('/api/categories/:id', authenticateToken, (req, res) => {
    const { name, description, display_order } = req.body;
    db.run("UPDATE categories SET name = ?, description = ?, display_order = ? WHERE id = ?",
        [name, description, display_order, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Category updated successfully' });
        }
    );
});

app.delete('/api/categories/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM categories WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Category deleted successfully' });
    });
});

// --- Menu Routes ---

app.get('/api/menu', (req, res) => {
    db.all("SELECT * FROM menu_items", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Map database fields to frontend expectations
        const mappedRows = rows.map(row => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            category: row.category,
            categoryId: row.category, // Use category as categoryId if not stored separately
            image: row.image_url || row.image, // Map image_url to image
            featured: Boolean(row.featured), // Convert 0/1 to boolean
            available: Boolean(row.available), // Convert 0/1 to boolean
            spicyLevel: row.spicyLevel || 0
        }));

        res.json(mappedRows);
    });
});

app.post('/api/menu', authenticateToken, (req, res) => {
    const { name, description, price, category, image_url, featured, available } = req.body;
    db.run("INSERT INTO menu_items (name, description, price, category, image_url, featured, available) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, description, price, category, image_url, featured ? 1 : 0, available ? 1 : 1],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, ...req.body });
        }
    );
});

app.put('/api/menu/:id', authenticateToken, (req, res) => {
    const { name, description, price, category, image_url, available, featured } = req.body;
    db.run("UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image_url = ?, available = ?, featured = ? WHERE id = ?",
        [name, description, price, category, image_url, available ? 1 : 0, featured ? 1 : 0, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Updated successfully' });
        }
    );
});

app.delete('/api/menu/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM menu_items WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted successfully' });
    });
});

// --- Reservation Routes ---

app.post('/api/reservations', (req, res) => {
    const { name, email, phone, date, time, guests } = req.body;
    db.run("INSERT INTO reservations (name, email, phone, date, time, guests) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, phone, date, time, guests],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Reservation created' });
        }
    );
});

app.get('/api/reservations', authenticateToken, (req, res) => {
    db.all("SELECT * FROM reservations ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/reservations/:id/status', authenticateToken, (req, res) => {
    const { status } = req.body;
    db.run("UPDATE reservations SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Status updated' });
    });
});

// --- Reservation Routes ---

app.post('/api/reservations', (req, res) => {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;
    db.run("INSERT INTO reservations (name, email, phone, date, time, guests, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, email, phone, date, time, guests, specialRequests || ''],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Reservation created successfully' });
        }
    );
});

app.get('/api/reservations', authenticateToken, (req, res) => {
    db.all("SELECT * FROM reservations ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Map database fields to frontend expectations
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
    });
});

app.put('/api/reservations/:id/status', authenticateToken, (req, res) => {
    const { status } = req.body;
    db.run("UPDATE reservations SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Reservation status updated successfully' });
    });
});

app.delete('/api/reservations/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM reservations WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Reservation deleted successfully' });
    });
});

// --- Contact Messages Routes ---

app.post('/api/messages', (req, res) => {
    const { name, email, subject, message } = req.body;
    db.run("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
        [name, email, subject, message],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Message sent successfully' });
        }
    );
});

app.get('/api/messages', authenticateToken, (req, res) => {
    db.all("SELECT * FROM messages ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Map database fields to frontend expectations
        const mappedRows = rows.map(row => ({
            id: row.id.toString(),
            name: row.name,
            email: row.email,
            subject: row.subject,
            message: row.message,
            status: row.status || (row.read ? 'read' : 'unread'), // Fallback for old data
            createdAt: row.created_at
        }));

        res.json(mappedRows);
    });
});

app.put('/api/messages/:id/status', authenticateToken, (req, res) => {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    db.run("UPDATE messages SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Status updated successfully' });
    });
});

app.delete('/api/messages/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM messages WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Message deleted successfully' });
    });
});

// --- Visitor Counter Routes ---

app.get('/api/visitors', (req, res) => {
    db.get("SELECT value FROM site_content WHERE key = 'site_visitors'", [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        const count = row ? JSON.parse(row.value).count : 0;
        res.json({ count });
    });
});

app.post('/api/visitors/increment', (req, res) => {
    db.get("SELECT value FROM site_content WHERE key = 'site_visitors'", [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        let count = 0;
        if (row) {
            try { count = JSON.parse(row.value).count; } catch (e) { }
        }

        count += 1;
        const value = JSON.stringify({ count });

        db.run("INSERT INTO site_content (key, value) VALUES ('site_visitors', ?) ON CONFLICT(key) DO UPDATE SET value = ?",
            [value, value],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ count });
            }
        );
    });
});

app.post('/api/visitors/reset', authenticateToken, (req, res) => {
    const value = JSON.stringify({ count: 0 });
    db.run("INSERT INTO site_content (key, value) VALUES ('site_visitors', ?) ON CONFLICT(key) DO UPDATE SET value = ?",
        [value, value],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ count: 0, message: 'Visitor count reset' });
        }
    );
});

// --- Site Content Routes ---

app.get('/api/content/:key', (req, res) => {
    db.get("SELECT value FROM site_content WHERE key = ?", [req.params.key], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.json(null);
        try {
            res.json(JSON.parse(row.value));
        } catch (e) {
            res.json(row.value);
        }
    });
});

app.post('/api/content/:key', authenticateToken, (req, res) => {
    const { key } = req.params;
    const value = JSON.stringify(req.body);

    console.log(`Saving content for key: ${key}, Size: ${(value.length / 1024 / 1024).toFixed(2)} MB`);

    db.run("INSERT INTO site_content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?",
        [key, value, value],
        function (err) {
            if (err) {
                console.error(`Database error saving ${key}:`, err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Content updated' });
        }
    );
});

// --- Image Upload Routes ---

app.post('/api/upload/image', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    const { originalname, mimetype, buffer } = req.file;
    const base64Data = buffer.toString('base64');

    db.run(
        "INSERT INTO uploaded_images (filename, mimetype, data) VALUES (?, ?, ?)",
        [originalname, mimetype, base64Data],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                id: this.lastID,
                filename: originalname,
                url: `/api/images/${this.lastID}`
            });
        }
    );
});

app.get('/api/images/:id', (req, res) => {
    db.get("SELECT * FROM uploaded_images WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Image not found' });

        // Return as data URL
        const dataUrl = `data:${row.mimetype};base64,${row.data}`;
        res.json({ id: row.id, filename: row.filename, dataUrl });
    });
});

// --- User Management Routes ---

app.get('/api/users', authenticateToken, (req, res) => {
    db.all("SELECT id, name, email, role, created_at FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/users', authenticateToken, (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role || 'admin'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, email, role });
        }
    );
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User deleted successfully' });
    });
});

app.delete('/api/images/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM uploaded_images WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Image deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!process.env.SECRET_KEY) {
        console.warn('WARNING: using default SECRET_KEY. Set SECRET_KEY environment variable in production.');
    }
});
