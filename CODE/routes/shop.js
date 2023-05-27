// urls prefixed with /shop
const path = require('path');
const db = require('../database/database.js');
const {loginRequired, shopOwner} = require('../middlewares/verify.js');
const upload = require('../database/upload.js');

// module exports.
const router = require('express').Router();

// URL paths.
router.get('/create', loginRequired, (req, res) => {
   res.render(path.join(__dirname +  '/../views/createShop.ejs'));
})

router.post('/create', loginRequired, (req, res) => {
   // Inserting the shop information in database to create a new shop.
   const sql = `INSERT INTO shops(name, city, area, users_id) VALUES(${db.escape(req.body.name)}, ${db.escape(req.body.city)}, ${db.escape(req.body.area)}, ${db.escape(req.user.id)})`;
   db.query(sql, (err, result) => {
      if(err) {
         console.error(err);
         res.redirect('/shop/create');
      }
      else {
         res.redirect('/');
      }
   })
})

router.get('/:id', shopOwner, (req, res) => {
   const sql = `SELECT * FROM shops WHERE id = ${db.escape(req.params.id)}`; //Information about the specific shop.
   db.query(sql, (err, shops) => {
      if(err) {
         shops = {};
         console.error(err);
      }
      const sql = `SELECT * FROM products WHERE shops_id = ${db.escape(req.params.id)}`;
      db.query(sql, (err, products) => {
         if(err) {
            console.error(err);
            products = {}
         }
         res.render(path.join(__dirname +  '/../views/shop.ejs'), {shop: shops[0], products, user: req.user});
      })
   })
});

router.get('/:id/addproduct', (req, res) => {
   res.render(path.join(__dirname +  '/../views/addProduct.ejs'));
})

router.post('/:id/addproduct', upload.single('file'), (req, res) => { //upload.single comes from multer. Used to upload files.
   const sql = `INSERT INTO products(name, price, image, description, shops_id)
                           Values(${db.escape(req.body.name)}, ${Number(req.body.price)}, ${db.escape(req.file.filename)}, ${db.escape(req.body.description)}, ${db.escape(req.params.id)})`;
   db.query(sql, (err, result) => {
      if(err) {
         res.redirect(`/shop/${req.params.id}/addproduct`);
         console.error(err)
      }
      else {
         res.redirect(`/shop/${req.params.id}`);
      }
   })
})

router.get('/:id/updateshopinfo', (req, res) => {
   res.render(path.join(__dirname +  '/../views/updateShopInfo.ejs'), {shop_id: req.params.id});
})

router.post('/:id/updateinfo', (req, res) => {
   const sql = `UPDATE shops SET name = ${db.escape(req.body.name)}, city = ${db.escape(req.body.city)}, area = ${db.escape(req.body.area)} WHERE id = ${db.escape(req.params.id)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.error(err);
      }
   })
   res.redirect(`/shop/${req.params.id}`);
})

router.post('/:id/changeimage', upload.single('file'), (req, res) => { //upload.single comes from multer. Used to upload files.
   const sql = `UPDATE shops SET image = ${db.escape(req.file.filename)} WHERE id = ${db.escape(req.params.id)}`;
   db.query(sql, (err, result) => {
      if(err) {
         res.redirect(`/shop/${req.params.id}/changeimage`);
         console.error(err)
      }
      else {
         res.redirect(`/shop/${req.params.id}`);
      }
   })
})

router.get('/:id/delete', async (req, res) => {
   let sql = `SELECT * FROM products WHERE shops_id = ${db.escape(req.params.id)}`;
   await db.query(sql, async (err, result) => {
      if(err) {
         console.error(err);
      }
      else if(result.length) {
         sql = `DELETE FROM comments WHERE`;
         result.forEach((res, index) => {
            if(index) {
               sql += ` OR products_id = ${db.escape(res.id)}`;
            }
            else {
               sql += ` products_id = ${db.escape(res.id)}`;
            }
         })
         await db.query(sql, (err) => {
            if(err) {
               console.error(err);
            }
         })
      }
   })
   sql = `DELETE FROM products WHERE shops_id = ${db.escape(req.params.id)}`;
   await db.query(sql, (err, result) => {
      if(err) {
         console.error(err)
      }
   })
   sql = `DELETE FROM shops WHERE id = ${db.escape(req.params.id)}`;
   await db.query(sql, (err) => {
      if(err) {
         console.error(err);
      }
      res.redirect('/');
   })
})


module.exports = router;
