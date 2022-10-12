const couchImg = document.querySelector("item__img");
const couchtitle = document.getElementById('title');
const couchprice = document.getElementById('price');
const couchdescription = document.getElementById('description');
const couchcolors = document.getElementById('colors');

let id = new URLSearchParams(window.location.search).get('id')
console.log(id)

fetch("http://localhost:3000/api/products/"+ id)
.then(response => response.json())
.then(data => {
    console.log(data)
    displayitems(data)
})
.catch(error => console.log(error));

function displayitems()