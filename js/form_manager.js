
function createBody(name, surname, email, company, tel, url) {
    var body = `<p>DEMO REQUEST from `+ name  + ` ` + surname +`</p>
    <p> Company: `+ company + ` </p>
    <p> Mail: `+ email + ` </p>
    <p> Phone: `+ tel + ` </p>
    <p> web: `+ url + ` </p>`;

    return body;
}

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
        Password: "077FB9D43E02D06FF891C259D2CF44538C49",
        To: "choped123@gmail.com",
        From: "francisco.amor@smartshipping.es",
        Subject: "Demo request from " + name + " - " + company,
        Body: createBody(name, surname, email, company, tel, url)
    }).then(
        message => console.log(message)
    );

    //Prevent the form from being sent (page realoaded)
    e.preventDefault();


});


