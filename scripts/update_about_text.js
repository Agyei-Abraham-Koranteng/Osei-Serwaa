import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../server/database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the SQLite database.');
});

const shortText = "Sharing Ghana's rich culinary heritage, inspired by our founder's grandmother, Osei Serwaa.";

db.serialize(() => {
    // 1. Update hero_texts
    db.get("SELECT value FROM site_content WHERE key = 'hero_texts'", (err, row) => {
        if (err) console.error(err);
        if (row) {
            const heroTexts = JSON.parse(row.value);
            if (heroTexts.about) {
                heroTexts.about.subtitle = shortText;
                db.run("UPDATE site_content SET value = ? WHERE key = 'hero_texts'", [JSON.stringify(heroTexts)], (err) => {
                    if (err) console.error(err);
                    else console.log("Updated hero_texts.about.subtitle");
                });
            }
        }
    });

    // 2. Update about_content
    db.get("SELECT value FROM site_content WHERE key = 'about_content'", (err, row) => {
        if (err) console.error(err);
        if (row) {
            const aboutContent = JSON.parse(row.value);
            if (aboutContent.story) {
                aboutContent.story.paragraph1 = shortText;
                db.run("UPDATE site_content SET value = ? WHERE key = 'about_content'", [JSON.stringify(aboutContent)], (err) => {
                    if (err) console.error(err);
                    else console.log("Updated about_content.story.paragraph1");
                });
            }
        }
    });
});

// Close after a short delay to ensure queries finish (simple approach for script)
setTimeout(() => {
    db.close((err) => {
        if (err) console.error(err.message);
        console.log('Close the database connection.');
    });
}, 1000);
