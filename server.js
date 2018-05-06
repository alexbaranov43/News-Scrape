var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan")
var axios = require("axios")
var cheerio = require("cheerio");

var db = require("./models")

var app = express();

app.use(logger("dev"));

app.use(boyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars")

mongoose.connect("mongod://localhost/News-Scraper");

app.get("/scrape", function (req, res) {
    axios.get("https://www.vice.com/en_us/").then(function (response) {

        var $ = cheerio.load(resonse.data);

        $("h2.grid__wrapper__card__text__title").each(function (i, element) {
            var result = {};
            result.title = $(this)
                .text();
            result.link = $(this)
                .parent().parent().parent("a")
                .attr("href")
            result.summary = $(this)
                .parent()
                .text();

            db.article.create(resuts)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });

        res.send("Scrape Complete")
    });
});

app.get("/articles/:id", function (req, res) {
    db.article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err)
        });
});

app.post("/articles/:id", function(req, res){
    db.note.create(req.body)
        .then(function(dbNote){
            return db.article.findOneAndUpdate({ _id: req.params.id}, { note: dbNote._id}, { new: true})
        })
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        })
})

app.listen (PORT, function(){
    console.log("App running on port " + PORT + "!")
});