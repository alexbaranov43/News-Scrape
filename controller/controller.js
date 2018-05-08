var express = require("express");
var session = require("express-session");
var router = express.Router();
var db = require("../models");
var hbsObject;
router.get("/", function (req, res) {
    db.article.find({})
        .then(function (result) {
            hbsObject= {
                articles: result
            }

            res.render("index", hbsObject)
        })
})

router.get("/saved", function (req, res) {

    db.article.find({})
        .then(function (result) {
            hbsObject = {

                articles: result

            }
            console.log(hbsObject)
            res.render("saved", hbsObject)
        })
})





module.exports = router;