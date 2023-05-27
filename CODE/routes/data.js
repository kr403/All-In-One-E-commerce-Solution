const db = require('../database/database');

const router = require('express').Router();

router.get('/shopexist/:name', (req, res) => {
   const sql = `SELECT * FROM shops WHERE name = ${db.escape(req.params.name)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.error(err);
         res.send('error');
      }
      else {
         if(result.length) {
            res.json({doesExist: true});
         }
         else {
            res.json({doesExist: false});
         }
      }
   })
})

router.get('/product/:name', (req, res) => {
   productName = `%${db.escape(req.params.name).slice(1, req.params.name.length + 1)}%`;
   const sql = `SELECT * FROM products WHERE name LIKE '${productName}'`;
   db.query(sql, (err, result) => {
      res.json(result);
   })
})

router.get('/user/:name', (req, res) => {
   userName = `%${db.escape(req.params.name).slice(1, req.params.name.length + 1)}%`;
   const sql = `SELECT * FROM users WHERE name LIKE '${userName}'`;
   db.query(sql, (err, result) => {
      res.json(result);
   })
})


module.exports = router;
