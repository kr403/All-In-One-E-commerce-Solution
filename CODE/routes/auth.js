const router = require('express').Router();
const path = require('path');
const db = require('../database/database.js');
const bcrypt = require('bcrypt');

// All the routes here start with /auth

// Routes for login in a page.
router.get('/login', (req, res) => {
   res.render(path.join(__dirname +  '/../views/login.ejs'));
})

router.post('/login', (req, res) => {
   const sql = `SELECT * FROM USERS WHERE email =  ${db.escape(req.body.email)}`;
   db.query(sql, (error, result) => {
      if(error) { // Checking query error.
         console.log(error);
         res.redirect('/auth/login');
      }
      else {
         // Hashing the password and comapring it to database.
         if(result.length && bcrypt.compareSync(req.body.password, result[0].password)) {
            req.session.userId = result[0].id;
            res.redirect('/');
         }
         else {
            res.redirect('/auth/login');
         }
      }
   })
})


// Routes for login.
router.get('/logout', (req, res) => {
   req.session.destroy((err) => {
      if(err) {
         console.log(err);
      }
      res.redirect('/');
   })
})

router.get('/register', (req, res) => {
res.render(path.join(__dirname +  '/../views/register.ejs'));
})

router.post('/register', (req, res) => {
   const sql = `SELECT * FROM users WHERE email = ${db.escape(req.body.email)}`;
   db.query(sql, (err, result) => { // First query is to check if there is a user with the given email.
      if(err) { // Checking query error.
         console.log(err);
         res.redirect('/auth/register');
      }
      else {
         if(result.length) {
            console.log('User Exists!');
            res.redirect('/auth/register')
         }
         else {
            req.body.password = bcrypt.hashSync(req.body.password, 14); //hashing the password before saving it.
            const sql = `INSERT INTO users(DOB, email, name,  password, phone)
                              VALUES(${db.escape(req.body.date)}, ${db.escape(req.body.email)}, ${db.escape(req.body.name)}, ${db.escape(req.body.password)}, ${db.escape(req.body.phone)})`;
            db.query(sql, (error, result) => {
               if(error) {
                  console.log(error);
                  res.redirect('/auth/register');
               }
               else {
                  res.redirect('/auth/login');
               }
            })
         }
      }
   })
})


router.post('/login', (req, res) => {

})

module.exports = router;