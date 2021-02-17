const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'vinibjazevich',
  database: 'slackreactor',
  host: 'localhost',
  password: 'password',
  port: 5432,
})

module.exports = pool;
//5432