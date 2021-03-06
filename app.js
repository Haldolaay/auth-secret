
const express = require('express'); // server
const bodyParser = require('body-parser'); // to handle requests 
// const cookieParser = require('cookie-parser') //
const ejs = require('ejs'); // to render html from inside javascript
const app = express(); // starting the server
const mysql = require('mysql') // database driver
const session = require('express-session') // used for cookie handeling
require('dotenv').config() // using environment variables
// setting up express 
app.use(express.static('/public')); // public path
app.use(bodyParser.urlencoded({
  extended: true
})); // parsing the request
app.use(session({
  secret: "thisIsTopSecret"
}))
// app.use(cookieParser);
app.set('view engine', 'ejs'); // using ejs





// connection authintication
const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  insecureAuth: true
});
// connecting to mysql
connection.connect(function (err) {
  if (err) throw err;
  console.log(" mysql Connected!");

});
//testing
app.get('/hello', (req, res) => {
  let sql = 'SELECT * FROM input';

  connection.query(sql, (err, result) => {
    console.log(result)
  })
  let sees = req.session;
  res.send(sees);
})

// creating the paths
//main path
app.get('/', (req, res) => {
  res.render('home')
})
//login path
app.get('/login', (req, res) => {
  res.render('login')
});
app.post('/login', (req, res) => {
  console.log(req.body);
  res.render('submit')
})
// regester path
app.get('/register', (req, res) => {
  res.render('register')
});
app.post('/register', (req, res) => {
  let username = req.body.username;
  let userpassword = req.body.password;
  let s = req.session;
  console.log(userpassword);
//user values saved in an obj 
  let data = {
    username: username,
    password: userpassword
  };
  let sql = `INSERT INTO ${process.env.TABLE_NAME} SET ?`
  //  let sql = `INSERT INTO '${process.env.DATABASE_NAME}'.'${process.env.TABLE_NAME}`
  connection.query(sql, data, (err, result) => {
    console.log(err)
  })
  res.render('secrets')
})
// app listening to port 
app.listen(3000, () => {
  console.log('working!')
})