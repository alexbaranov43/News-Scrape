
//clicking on p tag
$(document).on("click", "#artNote", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h2 id='noteHeading'>" + data.title + "</h2>");
            $("#notes").append("<input id='titleInput' name='title'><br><br>");
            $("#notes").append("<textarea id='bodyInput' name='body'></textarea><br><br>");
            $("#notes").append("<button data-id='" + data._id + "' id='saveNote'>Save Note</button>");

            if (data.note) {
                $("#titleInput").val(data.note.title)
                $("#bodyInput").val(data.note.body)
            }
        })
})


$(document).on("click", "#saveArticle", function () {
    var thisId = $(this).attr("data-id")
    let isSaved = $(this).attr("saved")

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
    };
})

$(document).on("click", "#delete", function () {
    var thisId = $(this).attr("data-id")
    let isSaved = $(this).attr("saved")

    if (isSaved === "true") {
        $.ajax({
            method: "PUT",
            url: "/articles/" + thisId,
            data: {
                saved: false
            }
        })
            .then(function (data) {
                console.log(data)
            })
    };
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
