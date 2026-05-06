const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'bikepoints.db');

const db = new Database(dbPath);

console.log('🔥 SQLite conectado');

db.prepare(`
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY,
        brabo INTEGER DEFAULT 0,
        gabriel INTEGER DEFAULT 0
    )
`).run();

const scoreExists = db.prepare(`
    SELECT * FROM scores WHERE id = 1
`).get();

if (!scoreExists) {

    db.prepare(`
        INSERT INTO scores
        (id, brabo, gabriel)
        VALUES
        (1, 0, 0)
    `).run();

    console.log('🏁 Score inicial criado');
}

module.exports = db;