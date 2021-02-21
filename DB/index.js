const Pool = require('pg').Pool;
require('dotenv').config({
  path: `${__dirname}/../.env`
});


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

if (process.env.NODE_ENV === 'production'){
  console.log('Connection in production mode')
} else {
  console.log('ENV is a piece of shit and doesnt work')
}

  module.exports = pool; //5432