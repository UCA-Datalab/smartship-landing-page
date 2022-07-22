<<<<<<< HEAD
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
=======

function createBody(name, surname, email, company, tel, url) {
    var body = `<p>DEMO REQUEST from `+ name  + ` ` + surname +`</p>
    <p> Company: `+ company + ` </p>
    <p> Mail: `+ email + ` </p>
    <p> Phone: `+ tel + ` </p>
    <p> web: `+ url + ` </p>`;

    return body;
}
API_KEY = "AIzaSyDmiLWshXAml2cAKr--D30mW6IGYeG3rDQ";
document.addEventListener("submit", (e) => {
   

    // Store reference to form to make later code easier to read
    form = e.target
    //console.log(form)
    var email = form.email.value;
    var name = form.name.value;
    var surname = form.surname.value;
    var company = form.company.value;
    var tel = form.tel.value;
    var url = form.url.value;

    console.log(createBody(name, surname, email, company, tel,url))
    //console.log(email, name, surname, institution)

    //Send reception email to the user
    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "francisco.amor@smartshipping.es",
        Password: "BC69528419BF939044F67046BCB801E7DB7A",
        To: "javijj99@gmail.com",
        From: "francisco.amor@smartshipping.es",
        Subject: "Demo request from " + name + " - " + company,
        Body: createBody(name, surname, email, company, tel, url)
    }).then(
        message => console.log(message)
    );
>>>>>>> 7ed184f5d5871038300871a1ce05987a290c571e

    //Prevent the form from being sent (page realoaded)
    e.preventDefault();


});


