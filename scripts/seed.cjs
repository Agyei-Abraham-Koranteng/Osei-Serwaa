const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'server', 'database.sqlite');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('✓ Connected to database');
});

const dishes = [
    ['Jollof Rice', 'Our signature West African rice dish cooked in a rich tomato sauce with aromatic spices, served with your choice of protein', 45.00, 'Main Dishes', '/dish-jollof.jpg', 1],
    ['Banku with Tilapia', 'Traditional fermented corn and cassava dough served with grilled tilapia and spicy pepper sauce', 55.00, 'Main Dishes', '/dish-banku.jpg', 1],
    ['Waakye', 'Rice and beans cooked with millet leaves, served with spaghetti, gari, boiled egg, and your choice of protein', 40.00, 'Main Dishes', '/dish-waakye.jpg', 1],
    ['Fufu with Light Soup', 'Pounded cassava and plantain served with aromatic tomato-based soup and goat meat', 50.00, 'Main Dishes', '', 1],
    ['Red Red', 'Black-eyed peas stew cooked in palm oil with plantains and gari', 35.00, 'Main Dishes', '', 1],
    ['Kelewele', 'Spicy fried plantains seasoned with ginger, pepper, and aromatic spices', 15.00, 'Appetizers', '', 1],
    ['Chinchinga (Kebabs)', 'Grilled skewered meat marinated in traditional spices and peanut powder', 25.00, 'Appetizers', '', 1],
    ['Groundnut Soup', 'Rich peanut-based soup with chicken or beef, served with rice balls or fufu', 48.00, 'Soups', '', 1],
    ['Palmnut Soup', 'Creamy palm fruit soup with assorted meats and fish, served with fufu', 52.00, 'Soups', '', 1],
    ['Sobolo (Hibiscus Drink)', 'Refreshing hibiscus flower drink with ginger and pineapple', 10.00, 'Beverages', '', 1],
    ['Asana (Corn Drink)', 'Traditional fermented corn drink, sweet and refreshing', 8.00, 'Beverages', '', 1],
    ['Bofrot (Puff Puff)', 'Sweet fried dough balls, perfect with tea or as a snack', 12.00, 'Desserts', '', 1]
];

db.serialize(() => {
    // Create table
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
            console.error('Error creating table:', err.message);
            process.exit(1);
        }
        console.log('✓ Table ready');

        // Insert dishes
        const stmt = db.prepare('INSERT INTO menu_items (name, description, price, category, image_url, available) VALUES (?, ?, ?, ?, ?, ?)');

        dishes.forEach((dish, index) => {
            stmt.run(dish, (err) => {
                if (err) console.error(`Error adding dish ${index + 1}:`, err.message);
                else console.log(`✓ Added: ${dish[0]} - GH₵${dish[2]}`);
            });
        });

        stmt.finalize(() => {
            db.get('SELECT COUNT(*) as count FROM menu_items', (err, row) => {
                if (err) console.error('Error:', err.message);
                else console.log(`\n✓ Total menu items: ${row.count}`);
                db.close();
            });
        });
    });
});
