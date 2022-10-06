require('dotenv').config()
const Pool = require('pg').Pool
const connectionString = `postgresql://postgres:${process.env.DB_PASS}@containers-us-west-44.railway.app:5970/railway`

const pool = new Pool({
    connectionString
})

module.exports = pool