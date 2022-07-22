document.addEventListener("submit", (e) => {
    $.ajax({
        url:'https://api.apispreadsheets.com/data/lxUiJTm9auzfiPz9/',
        type:'post',
        data:$("#FormDemo").serializeArray(),
        success: function(){
          console.log("Form Data Submitted :)")
        },
        error: function(){
          console.log("There was an error :(")
        }
    });

    //Prevent the form from being sent (page realoaded)
    e.preventDefault();


});


