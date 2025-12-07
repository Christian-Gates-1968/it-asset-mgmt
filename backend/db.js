const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'krish',
  database: 'it_asset_mgmt',
});

module.exports = pool.promise();
