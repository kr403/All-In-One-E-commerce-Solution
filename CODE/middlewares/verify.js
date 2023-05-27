const db = require('../database/database.js');

// storing the data if logged in.
module.exports.authenticate = (req, res, next) => {
   global.user = undefined;
   if(!(req.session && req.session.userId)) {
      return next();
   }
   const sql = `SELECT * FROM users WHERE id = ${req.session.userId}`;
   db.query(sql, (error, result) => {
      if(error) {
         console.log(error);
         next();
      }
      if(result.length) {
         result[0].password = undefined;
         req.user = result[0];
         res.locals.user = result[0];
      }
      return next();
   })
}

// Making sure that there is a data stored for user.
module.exports.loginRequired = (req, res, next) => {
   if(!req.user) {
      return res.redirect('/auth/login')
   }
   else {
      next();
   }
}

// Making sure that the logged in user is an admin.
module.exports.isAdmin = (req, res, next) => {
   if(req.user && req.user.type === 'admin') {
      next();
   }
   else {
      res.redirect('/');
   }
}

// Making sure that the logged in user is a moderator.
module.exports.isModerator = (req, res, next) => {
   if(req.user && req.user.type === 'moderator') {
      next();
   }
   else {
      res.redirect('/');
   }
}

module.exports.shopOwner = (req, res, next) => {
   if(req.user) {
      const sql = `SELECT * FROM shops WHERE id = ${db.escape(req.params.id)}`;
      db.query(sql, (err, result) => {
         if(err) {
            console.error(err);
         }
         else {
            // console.log(result[0].users_id, req.user.id);
            if(result[0].users_id === req.user.id) {
               req.user.isOwner = true;
            }
            else {
               req.user.isOwner = false;
            }
         }
         next();
      })
   }
   else {
      next();
   }
}

module.exports.productShopOwner = (req, res, next) => {
   if(req.user) {
      let sql = `SELECT * FROM products WHERE id = ${db.escape(req.params.id)}`;
      db.query(sql, (err, product) => {
         if(err) {
            console.error(err);
         }
         else {
            sql = `SELECT * FROM shops WHERE id = ${db.escape(product[0].shops_id)}`;
            db.query(sql, (err, result) => {
               if(result[0].users_id === req.user.id) {
                  req.user.isOwner = true;
               }
               else {
                  req.user.isOwner = false;
               }
            })
         }
         next();
      })
   }
   else {
      next();
   }
}

