// baseDatos.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'alexander50',
  database: 'humedadp'
});

connection.connect();

module.exports = {
  getConnection: () => connection,
};
