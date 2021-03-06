var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan")
var axios = require("axios")
var cheerio = require("cheerio");

var db = require("./models")
var PORT = process.env.PORT || 3000;
var app = express();

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/News-Scraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars")


// mongoose.connect("mongodb://localhost/News-Scraper");
var routes = require("./controller/controller.js")
app.use(routes)

app.get("/scrape", function (req, res) {
    axios.get("https://www.vice.com/en_us/").then(function (response) {

        var $ = cheerio.load(response.data);

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

            db.article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });
        res.redirect('/')
    });
});

app.get("/articles", function (req, res) {
    db.article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//GRABBING ARTICLE BY ID
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


//UPDATING NOTE
app.post("/articles/:id", function (req, res) {
    db.note.create(req.body)
        .then(function (dbNote) {
            return db.article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
})

app.put("/articles/:id", function (req, res) {

    db.article.update({
        _id: req.params.id
    }, { $set: { saved: req.body.saved } })
        .then(function (dbArticle) {
            console.log(dbArticle)
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err)
        })

});


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!")
});