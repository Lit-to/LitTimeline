var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//mysql接続情報
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'litter'
})

// mysql接続
con.connect((err) => {
  if (err) throw err
  console.log('Connected')
})
module.exports = router;
