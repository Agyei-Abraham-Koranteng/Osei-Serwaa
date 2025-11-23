const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
    console.log('✓ Connected');
});

// Update categories to match the filter buttons
const updates = [
    // Main Dishes -> mains
    { oldCategory: 'Main Dishes', newCategory: 'mains' },
    // Appetizers -> starters
    { oldCategory: 'Appetizers', newCategory: 'starters' },
    // Soups -> mains (soups are main courses)
    { oldCategory: 'Soups', newCategory: 'mains' },
    // Beverages -> drinks
    { oldCategory: 'Beverages', newCategory: 'drinks' },
    // Desserts -> sides (or we could add a desserts category)
    { oldCategory: 'Desserts', newCategory: 'sides' }
];

db.serialize(() => {
    console.log('Updating categories...');

    updates.forEach(({ oldCategory, newCategory }) => {
        db.run(
            'UPDATE menu_items SET category = ? WHERE category = ?',
            [newCategory, oldCategory],
            function (err) {
                if (err) {
                    console.error(`Error updating ${oldCategory}:`, err.message);
                } else {
                    console.log(`✓ Updated ${this.changes} items from "${oldCategory}" to "${newCategory}"`);
                }
            }
        );
    });

    // Wait a bit then show final counts
    setTimeout(() => {
        db.all('SELECT category, COUNT(*) as count FROM menu_items GROUP BY category', (err, rows) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('\nFinal category counts:');
                rows.forEach(row => {
                    console.log(`  ${row.category}: ${row.count} items`);
                });
            }
            db.close();
        });
    }, 500);
});
