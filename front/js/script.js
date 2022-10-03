// constant for database URL
const URL = "http://localhost:3000/api/products"
// Call `fetch()`, passing in the URL.
fetch(URL)
  // fetch() returns a promise. When we have received a response from the server,
  // the promise's `then()` handler is called with the response.
  .then((response) => {
    // Our handler throws an error if the request did not succeed.
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    // Otherwise (if the response succeeded), our handler fetches the response
    // as text by calling response.text(), and immediately returns the promise
    // returned by `response.text()`.
    return response.json();
  })
  // When response.text() has succeeded, the `then()` handler is called with
  // the text, and we copy it into the `poemDisplay` box.
  .then((data) => console.log(data))
  // Catch any errors that might happen, and display a message
  // in the `poemDisplay` box.
  .catch((error) => {
    console.log(error)
    let sect
    //poemDisplay.textContent = `Could not fetch verse: ${error}`
  }
);