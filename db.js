const Pool = require('pg').Pool
const connectionString = 'postgresql://postgres:W0seE7svPC0JEEpUQn1N@containers-us-west-44.railway.app:5970/railway'

const pool = new Pool({
    connectionString
})

module.exports = pool