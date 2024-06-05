const { Pool } = require('pg');

const pool = new Pool({
    user: 'Admin',
    host: 'localhost',
    database: 'wcd',
    //password: 'yourpassword',
    port: 5432,
});

module.exports = pool;

