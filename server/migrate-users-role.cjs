const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    console.log('Attempting to add "role" column to users table...');
    db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'admin'", (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('Column "role" already exists.');
            } else {
                console.error('Error adding column "role":', err.message);
            }
        } else {
            console.log('Column "role" added successfully.');
        }
    });
});

db.close();
