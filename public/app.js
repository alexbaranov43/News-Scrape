//grab articles
$.getJSON("/articles", function (data) {
    for (i = 0; i < data.length; i++) {
        var artDiv = $("<div id='artDiv'>")
        artDiv.append("<h2 data-id='"+ data[i]._id + "' id='scrapeTitle'>" + data[i].title + "<br/><br/></h2>")
        artDiv.append("<p data-id=" + data[i]._id + ">" + data[i].summary +"<br/><br/>" + data[i].link + "<br/></p>");
        var save = $("<button id=saveArticle> Save Article</button>")
        save.attr("data-id", data[i]._id);
        save.attr("title", data[i].title)
        save.attr("href", data[i].link)
        save.attr("summary", data[i].summary)
        save.attr("saved", data[i].saved)
        artDiv.append(save)
        $("#articles").append(artDiv);
    }
});

//clicking on p tag
$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleInput' name='title'><br/>");
            $("#notes").append("<textarea id='bodyInput' name='body'></textarea><br/>");
            $("#notes").append("<button data-id='" + data._id + "' id='saveNote'>Save Note</button>");

            if (data.note) {
                $("#titleInput").val(data.note.title)
                $("#bodyInput").val(data.note.body)
            }
        })
})


$(document).on("click", "#saveArticle", function () {
    var thisId = $(this).attr("data-id")
    var isSaved = $(this).attr("saved")
    if (isSaved === "false") {
        $.ajax({
            method: "PUT",
            url: "/articles/" + thisId,
            data: {
                saved: true
            }
        })
            .then(function (data) {
                console.log(data)
            })
    }
})

$(document).on("click", "#saveNote", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleInput").val(),
            body: $("#bodyInput").val()
        }
    })
        .then(function (data) {
            console.log(data)
            $("#notes").empty()
        });

    $("#titleInput").val("");
    $("#bodyInput").val("");
})
