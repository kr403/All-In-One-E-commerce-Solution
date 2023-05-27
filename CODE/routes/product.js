// Imports.
const router = require('express').Router();
const path = require('path');
const db = require('../database/database.js');
const {loginRequired, productShopOwner} = require('../middlewares/verify.js');
const upload = require('../database/upload.js');

router.get('/:id', productShopOwner, (req, res) => {
   // Check if there is a user.
   let user = undefined;
   if(req.user) {
      user = req.user;
   }
   // Get the product and all the comments of that product.
   const sql = `SELECT p.name as productName, p.image, p.shops_id, p.id as product_id,
               p.description as productDescription, u.name as username,
               c.content as commentContent, c.time as commentTime,
               p.verify as verify, p.price as price
               FROM products as p
               LEFT JOIN comments as c
               ON p.id = c.products_id
               LEFT JOIN users as u
               ON c.users_id = u.id
               WHERE p.id = ${db.escape(req.params.id)}
               `;
   db.query(sql, (err, result) => {
      res.render(path.join(__dirname +  '/../views/product.ejs'), {products: result, user});
   });
});

router.post('/:id/createcomment', loginRequired, (req, res) => {
   const sql = `INSERT INTO comments(content, time, users_id, products_id)
                              VALUES(${db.escape(req.body.commentContent)}, now(), ${db.escape(req.user.id)}, ${db.escape(req.params.id)})`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err)
      }
   })
})

router.get('/:id/updateproductinfo', (req, res) => {
   res.render(path.join(__dirname +  '/../views/updateProductInfo.ejs'), {product_id: req.params.id});
})

router.post('/:id/updateinfo', (req, res) => {
   const sql = `UPDATE products SET name = ${db.escape(req.body.name)}, price = ${db.escape(req.body.price)}, description = ${db.escape(req.body.description)} WHERE id = ${db.escape(req.params.id)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.error(err);
      }
   })
   res.redirect(`/product/${req.params.id}`);
})

router.post('/:id/changeimage', upload.single('file'), (req, res) => { //upload.single comes from multer. Used to upload files.
   const sql = `UPDATE products SET image = ${db.escape(req.file.filename)} WHERE id = ${db.escape(req.params.id)}`;
   db.query(sql, (err, result) => {
      if(err) {
         res.redirect(`/product/${req.params.id}/changeimage`);
         console.error(err)
      }
      else {
         res.redirect(`/product/${req.params.id}`);
      }
   })
})

router.get('/:id/delete', (req, res) => {
   const sql = `DELETE FROM comments WHERE products_id = ${db.escape(req.params.id)}`;
   db.query(sql, err => {
      const sql = `DELETE FROM products WHERE id = ${db.escape(req.params.id)}`;
      db.query(sql, (err) => {
         if(err) {
            console.error(err);
         }
         res.redirect('/');
      })
   })
})

router.post('/:id/verify', (req, res) => {
   const sql = `UPDATE products SET verify = 'waiting' WHERE id = ${req.params.id}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.error(err);
         res.json({"status": "Error"});
      }
   })
   res.json({"status": "success"})
})


module.exports = router;
