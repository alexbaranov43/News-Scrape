//grab articles
$.getJSON("/articles", function(data){
    for (i = 0; i<data.length; i++){
        $("#articles").append("<p data-id=" + data[i]._id + ">" + data[i].title +"<br/>" + data[i].link + "<br/>" + data[i].summary + "</p>");
        // var save = $("<button>Save Article</button>")
        // save.attr("data-id", data[i].id);
        // save.attr("title", data[i].title)
        // save.attr("href", data[i].link)
        // save.attr("summary", data[i].summary)
        // $("#articles").append(save)
    }
});

//clicking on p tag
$(document).on("click", "p", function(){
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data){
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleInput' name='title'>");
        $("#notes").append("<textarea id='bodyInput' name='body'></textarea>");
        $("#notes").append("<button data-id='"+data_id +"' id='saveNote'>Save Note</button>");

        if (data.note){
            $("titleInput").val(data.note.title)
            $("bodyInput").val(data.note.body)
        }
    })
})


$(document).on("click", "#saveNote", function(){
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId
    })
    .then(function(data){
        console.log(data)
        $("#notes").empty()
    });

    $("#titleInput").val("");
    $("#bodyInput").val("");
})
