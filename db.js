const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    password: '12345',
    host: 'localhost',
    database: 'urlshortener', 
    port: '5432'
})

module.exports = pool