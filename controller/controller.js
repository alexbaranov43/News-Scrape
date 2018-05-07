var express = require("express");
var session = require("express-session");
var router = express.Router();
var db = require("../models");

router.get("/", function (req, res) {
    var hbsObject;
    db.article.find({})
        .then(function (result) {
            hbsObject: {
                articles: result
            }

            res.render("index", hbsObject)
        })
})

router.get("/saved", function(req, res){
    var hbsObject;
    db.article.find({
        where: {
            saved: true
        }
    })
        .then(function(result){
            hbsObject: {
                articles: result
            }
            res.render("saved", hbsObject)
        })
})





module.exports = router;