document.addEventListener("submit", (e) => {

    form = e.target
   
    $.ajax({
        url:'https://api.apispreadsheets.com/data/lxUiJTm9auzfiPz9/',
        type:'post',
        data:$("#FormDemo").serializeArray(),
        success: function(){
          console.log("Form Data Submitted :)")
          alert("Thanks for your interest!");
          form.reset();
        },
        error: function(){
          console.log("There was an error :(")
        }
    });

    //Prevent the form from being sent (page realoaded)
    e.preventDefault();
});