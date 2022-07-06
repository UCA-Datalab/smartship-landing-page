
function createBody(name, surname, email, company, text) {
    var body = `<p>DEMO REQUEST</p>
    <p> Name: `+ name + ` </p>
    <p> Surname: `+ surname + ` </p>
    <p> Company: `+ company + ` </p>
    <p> Mail: `+ email + ` </p>
    <p> Content: </p>
    <p> `+ text + ` </p>`;

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
    var text = form.text.value;

    console.log(createBody(name, surname, email, company, text))
    //console.log(email, name, surname, institution)

    //Send reception email to the user
    Email.send({
        Host: "smtp.gmail.com",
        Username: "smartshipping.contact@gmail.com",
        Password: "maffbhelmmcuroah",
        To: "info@smartshipping.es",
        From: "smartshipping.contact@gmail.com",
        Subject: "Demo request from " + name + " - " + company,
        Body: createBody(name, surname, email, company, text)
    }).then(
        message => console.log(message)
    );

    //Prevent the form from being sent (page realoaded)
    e.preventDefault();


});


