var express = require('express');
var router = express.Router();
let db = require('../service/db');

/* GET home page. */
router.get('/', function(req, res, next) {
// for testing
    let mockObj = {
        hisNameIs: 'Patty Mahomes',
        reaction: 'Woooowah',
        hes: [
            {
                who:'Paul Bunnon',
                meets:"Dan Marino"
            }
        ],
        goodjaboy: true
    };


    res.render('index', { title: 'Express' });
});

module.exports = router;
