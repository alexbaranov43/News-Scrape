
//clicking on p tag
$(document).on("click", "#artNote", function () {
    var thisId = $(this).attr("data-id");
    $("#notes"+thisId).empty();

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
;
            $("#notes"+thisId).append("<br><br><input id='titleInput' placeholder='Note Title' name='title'><br><br>");
            $("#notes"+thisId).append("<textarea id='bodyInput' placeholder='Note Body' name='body'></textarea><br><br>");
            $("#notes"+thisId).append("<button data-id='" + data._id + "' id='saveNote'>Save Note</button>");

            if (data.note) {
                $("#titleInput").val(data.note.title)
                $("#bodyInput").val(data.note.body)
            }
            $("#notes"+thisId).show()
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
                $("#notes"+thisId).empty()
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
            $("#notes"+thisId).hide()
        });

    $("#titleInput").val("");
    $("#bodyInput").val("");
})
