const Pool = require('pg').Pool;
require('dotenv').config();

const devConfig = {
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
}

const proConfig = {
  connectionString: process.env.DATABASE_URL //HEROKU ADD ON
}

const pool = new Pool(
  process.env.NODE_ENV === 'production' ? proConfig : devConfig
);

  module.exports = pool; //5432