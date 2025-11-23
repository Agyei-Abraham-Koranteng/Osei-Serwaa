import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./server/database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        process.exit(1);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    // Create menu_items table
    console.log('Creating menu_items table...');
    db.run(`CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    category TEXT,
    image_url TEXT,
    available BOOLEAN DEFAULT 1
  )`, (err) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('✓ Table created successfully');

        // Insert menu items
        const dishes = [
            { name: 'Jollof Rice', description: 'Our signature West African rice dish cooked in a rich tomato sauce with aromatic spices, served with your choice of protein', price: 45.00, category: 'Main Dishes', image_url: '/dish-jollof.jpg', available: 1 },
            { name: 'Banku with Tilapia', description: 'Traditional fermented corn and cassava dough served with grilled tilapia and spicy pepper sauce', price: 55.00, category: 'Main Dishes', image_url: '/dish-banku.jpg', available: 1 },
            { name: 'Waakye', description: 'Rice and beans cooked with millet leaves, served with spaghetti, gari, boiled egg, and your choice of protein', price: 40.00, category: 'Main Dishes', image_url: '/dish-waakye.jpg', available: 1 },
            { name: 'Fufu with Light Soup', description: 'Pounded cassava and plantain served with aromatic tomato-based soup and goat meat', price: 50.00, category: 'Main Dishes', image_url: '', available: 1 },
            { name: 'Red Red', description: 'Black-eyed peas stew cooked in palm oil with plantains and gari', price: 35.00, category: 'Main Dishes', image_url: '', available: 1 },
            { name: 'Kelewele', description: 'Spicy fried plantains seasoned with ginger, pepper, and aromatic spices', price: 15.00, category: 'Appetizers', image_url: '', available: 1 },
            { name: 'Chinchinga (Kebabs)', description: 'Grilled skewered meat marinated in traditional spices and peanut powder', price: 25.00, category: 'Appetizers', image_url: '', available: 1 },
            { name: 'Groundnut Soup', description: 'Rich peanut-based soup with chicken or beef, served with rice balls or fufu', price: 48.00, category: 'Soups', image_url: '', available: 1 },
            { name: 'Palmnut Soup', description: 'Creamy palm fruit soup with assorted meats and fish, served with fufu', price: 52.00, category: 'Soups', image_url: '', available: 1 },
            { name: 'Sobolo (Hibiscus Drink)', description: 'Refreshing hibiscus flower drink with ginger and pineapple', price: 10.00, category: 'Beverages', image_url: '', available: 1 },
            { name: 'Asana (Corn Drink)', description: 'Traditional fermented corn drink, sweet and refreshing', price: 8.00, category: 'Beverages', image_url: '', available: 1 },
            { name: 'Bofrot (Puff Puff)', description: 'Sweet fried dough balls, perfect with tea or as a snack', price: 12.00, category: 'Desserts', image_url: '', available: 1 }
        ];

        console.log('\nInserting menu items...');
        const stmt = db.prepare(`INSERT INTO menu_items (name, description, price, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?)`);

        dishes.forEach((dish) => {
            stmt.run(dish.name, dish.description, dish.price, dish.category, dish.image_url, dish.available, (err) => {
                if (err) {
                    console.error(`✗ Error adding ${dish.name}:`, err.message);
                } else {
                    console.log(`✓ Added: ${dish.name} - GH₵${dish.price}`);
                }
            });
        });

        stmt.finalize(() => {
            db.get("SELECT COUNT(*) as count FROM menu_items", (err, row) => {
                if (err) {
                    console.error('Error:', err);
                } else {
                    console.log(`\n✓ Total menu items: ${row.count}`);
                }
                db.close(() => {
                    console.log('Database connection closed.');
                });
            });
        });
    });
});
