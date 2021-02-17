const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'macuser',
  database: 'slackreactor',
  host: 'localhost',
  port: 5432,
})

module.exports = pool;
//5432