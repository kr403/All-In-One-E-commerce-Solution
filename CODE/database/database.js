const mysql = require('mysql');

require('dotenv').config();

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: process.env.DATABASE_PASSWORD,
   database: 'e_commerce_solution'
});

db.connect(err => {
   if(err) {
      console.log('Cannot connect to database');
   }
   else {
      console.log('connected to database');
   }
});

module.exports = db;