// constant for database URL
const URL = "http://localhost:3000/api/products"
//Calling fetch on that URL. This will instantly return a promise (if URL is valid databse).
fetch( URL )
    // the promise's `then()` handler is called with the response.
    .then(response => { const json =response.json()
        return json;
    })
    .then(data => {
        displayproduct(data)
    })
.catch(_error => {
    alert(console.error();
});

function displayproduct(data) {
    for (product of data) {}
}
