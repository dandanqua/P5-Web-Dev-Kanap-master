const couchImg = document.querySelector("item__img");
const couchtitle = document.getElementById('title');
const couchprice = document.getElementById('price');
const couchdescription = document.getElementById('description');
const couchcolors = document.getElementById('colors');

let id = new URLSearchParams(window.location.search).get('id')
console.log(id)

let imageURL = "";
let imageAlt = "";


fetch("http://localhost:3000/api/products/"+ id)
  .then(res => res.json())
  .then(data => {
    
    image[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    imageURL = data.imageUrl;
    imageAlt = data.altTxt;
    title.innerHTML = `<h1>${data.name}</h1>`;
    price.innerText = `${data.price}`;
    description.innerText = `${data.description}`;

    for (number in data.colors) {
      colors.options[colors.options.length] = new Option(
        data.colors[number],
        data.colors[number]
      );
    }
  })
   
  .catch(error => console.log(error));


const selectQuantity = document.getElementById('quantity');
const selectColors = document.getElementById('colors');

const addToCart = document.getElementById('addToCart');
addToCart.addEventListener('click', (event) => {
  event.preventDefault();

  const selection = {
    id: newID,
    image: imageURL,
    alt: imageAlt,
    name: title.textContent,
    price: price.textContent,
    color: selectColors.value,
    quantity: selectQuantity.value,
  };

  let productInLocalStorage =  JSON.parse(localStorage.getItem('product'));

  const addProductLocalStorage = () => {
  productInLocalStorage.push(selection);
  localStorage.setItem('product', JSON.stringify(productInLocalStorage));
  }

  let addConfirm = () => {
    alert('The product has been added to cart');
  }
  let update = false;
  if (productInLocalStorage) {
   productInLocalStorage.forEach (function (productOk, key) {
    if (productOk.id == newID && productOk.color == selectColors.value) {
      productInLocalStorage[key].quantity = parseInt(productOk.quantity) + parseInt(selectQuantity.value);
      localStorage.setItem('product', JSON.stringify(productInLocalStorage));
      update = true;
      addConfirm();
    }
  });

  //
    if (!update) {
    addProductLocalStorage();
    addConfirm();
    }
  }

  else {
    productInLocalStorage = [];
    addProductLocalStorage();
    addConfirm();
  }
});