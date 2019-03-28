var express = require('express');
var router = express.Router();
let db = require('../service/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
