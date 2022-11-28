/*
 * Retrieves the user's localStorage
 */
const dataStorage = JSON.parse(localStorage.getItem("cart"));
 
/*
 * Retrieves product data from the api
 */
async function retrieveProductData(id) {
  return (await fetch(`http://localhost:3000/api/products/${id}`)).json();
}
 
/*
 * Calls the function to retrieve product information
 * Returns an error console if retrieval is not possible
 */
const getProductData = async (id) => {
  try {
    return retrieveProductData(id);
  } catch {
    console.error("Error retrieving product data");
  }
};
 
/*
 * Create the global article that will contain the chosen product
 */
const createCardProduct = async (data) => {
  const product = await retrieveProductData(data.id);
  const cardItem = document.getElementById("cart__items");
  const articleItem = document.createElement("article");
  articleItem.setAttribute("class", "cart__item");
  articleItem.setAttribute("data-id", `${data.id}`);
  articleItem.setAttribute("data-color", `${data.color}`);
  cardItem.appendChild(articleItem);
  showImageProduct(articleItem, product.altTxt, product.imageUrl);
  showInfosItem(articleItem, product.name, data.color, product.price);
  showSettingsItem(articleItem, data.quantity);
};
 
/*
 * Create the modification part of the product
 */
function showSettingsItem(container, quantity) {
  const settingsItem = document.createElement("div");
  settingsItem.setAttribute("class", "cart__item__settings");
  container.appendChild(settingsItem);
  showQuantityProduct(settingsItem, quantity);
  showDeletedProduct(settingsItem);
}
 
/*
 * Create the product information section
 */
function showInfosItem(container, name, color, price) {
  const infosItem = document.createElement("div");
  infosItem.setAttribute("class", "cart__item__content");
  container.appendChild(infosItem);
  const descriptionItem = document.createElement("div");
  descriptionItem.setAttribute("class", "cart__item__content__description");
  infosItem.appendChild(descriptionItem);
  showTitleProduct(descriptionItem, name);
  showColorProduct(descriptionItem, color);
  showPriceProduct(descriptionItem, price);
}
 
/*
 * Display the image of the selected product
 */
function showImageProduct(container, altTxt, image) {
  const itemImg = document.createElement("div");
  itemImg.setAttribute("class", "cart__item__img");
  container.appendChild(itemImg);
 
  const img = document.createElement("img");
  img.setAttribute("src", image);
  img.setAttribute("alt", altTxt);
  itemImg.appendChild(img);
}
 
/*
 * Display the name of the selected product
 */
function showTitleProduct(div, title) {
  const titleItem = document.createElement("h2");
  titleItem.innerText = title;
 
  div.appendChild(titleItem);
}
 
/*
 * Display the chosen colour for the selected product
 */
function showColorProduct(div, color) {
  const colorItem = document.createElement("p");
  colorItem.innerText = color;
 
  div.appendChild(colorItem);
}
 
/*
 * Display the price for the selected product
 */
function showPriceProduct(div, price) {
  const priceItem = document.createElement("p");
  priceItem.innerText = price + "€";
 
  div.appendChild(priceItem);
}
 
/*
 * Display the quantity selector with the quantity chosen for the selected product
 */
function showQuantityProduct(div, quantity) {
  const settingsQuantity = document.createElement("div");
  settingsQuantity.setAttribute(
    "class",
    "cart__item__content__settings__quantity"
  );
  div.appendChild(settingsQuantity);
 
  const quantityItem = document.createElement("p");
  quantityItem.innerText = "Qté :";
  settingsQuantity.appendChild(quantityItem);
 
  const quantityInput = document.createElement("input");
  quantityInput.setAttribute("type", "number");
  quantityInput.setAttribute("class", "itemQuantity");
  quantityInput.setAttribute("name", "itemQuantity");
  quantityInput.setAttribute("min", "1");
  quantityInput.setAttribute("max", "100");
  quantityInput.setAttribute("value", `${quantity}`);
  settingsQuantity.appendChild(quantityInput);
}
 
/*
 * Show the button to delete a product
 */
function showDeletedProduct(div) {
  const settingsDeleted = document.createElement("div");
  settingsDeleted.setAttribute(
    "class",
    "cart__item__content__settings__delete"
  );
  div.appendChild(settingsDeleted);
 
  const deletedProduct = document.createElement("p");
  deletedProduct.setAttribute("class", "deleteItem");
  deletedProduct.innerText = "To delete";
  settingsDeleted.appendChild(deletedProduct);
}
 
/*
 * Listen when there is a change input on the page for each product, then update its quantity
 */
addEventListener("input", function () {
  let quantitySelector = document.getElementsByClassName("itemQuantity");
  for (let i = 0; i < quantitySelector.length; i++) {
    quantitySelector[i].addEventListener("change", (e) => {
      let productQuantity = e.target.value;
      if (productQuantity == 0 || productQuantity >= 100) {
        console.error("The quantity must be between 1 and 100");
        productQuantity = `${dataStorage[i].quantity}`;
      } else {
        dataStorage.map((obj) => {
          if (
            (obj.id == dataStorage[i].id, obj.color == dataStorage[i].color)
          ) {
            obj.quantity = parseInt(productQuantity);
          }
        });
        localStorage.setItem("cart", JSON.stringify(dataStorage));
        totalRefresh();
        console.log("Updated quantity");
      }
    });
  }
});
 
/*
 * For each product, if a click is made on the delete button, delete it
 */
window.onload = () => {
  let productDeleted = document.getElementsByClassName("deleteItem");
  for (let i = 0; i < productDeleted.length; i++) {
    productDeleted[i].addEventListener("click", (e) => {
      let articleDOM = productDeleted[i].closest("article");
      const productToClear = dataStorage.indexOf(dataStorage[i]);
      dataStorage.splice(productToClear, 1);
      articleDOM.remove();
      if (localStorage != undefined) {
        localStorage.setItem("cart", JSON.stringify(dataStorage));
      } else {
        localStorage.clear();
      }
      totalRefresh();
      console.log("Product removed from cart");
      location.reload()
    });
  }
};
 
/*
 * Displays the present value of the total number of items and the price
 */
const totalRefresh = async () => {
  let totalCartPrice = 0;
  let totalCartQty = 0;
  if (localStorage.length != 0) {
    for (let i = 0; i < dataStorage.length; i++) {
      let itemStorage = dataStorage[i];
      const product = await getProductData(itemStorage.id);
      totalCartPrice +=
        parseInt(itemStorage.quantity) * parseInt(product.price);
      totalCartQty += parseInt(itemStorage.quantity);
    }
  }
  const totalQuantity = document.getElementById("totalQuantity");
  totalQuantity.innerText = totalCartQty;
  const totalPrice = document.getElementById("totalPrice");
  totalPrice.innerText = totalCartPrice;
};
 
/*
 * Displays an error message if there is an incorrect field on the form
 */
function showErrorMsg(errorId, nameField) {
  let errorContainer = document.getElementById(`${errorId}`);
  errorContainer.innerHTML = `${nameField} is invalid`;
}
 
const globalRegex = new RegExp("^[A-Za-zéèêëàâîïôöûü-]+$");
 
/*
 * Checks that the form field "first name" matches the defined regex
 */
function verifyFirstName(prenom) {
  let fieldIsCorrect = false;
  if (globalRegex.test(prenom)) {
    fieldIsCorrect = true;
  } else {
    showErrorMsg("firstNameErrorMsg", "First name");
  }
  return fieldIsCorrect;
}
 
/*
 * Checks that the form field "last name" matches the defined regex
 */
function verifyLastName(nom) {
  let fieldIsCorrect = false;
  if (globalRegex.test(nom)) {
    fieldIsCorrect = true;
  } else {
    showErrorMsg("lastNameErrorMsg", "Name");
  }
  return fieldIsCorrect;
}
 
/*
 * Checks that the form field "address" matches the defined regex
 */
function verifyAddress(adresse) {
  let fieldIsCorrect = false;
  const adresseRegex = new RegExp(
    "([0-9]*)?([a-zA-Z]*)"
  );
  if (adresseRegex.test(adresse)) {
    fieldIsCorrect = true;
  } else {
    showErrorMsg("addressErrorMsg", "Address");
  }
  return fieldIsCorrect;
}
 
/*
 * Checks that the form field "city" matches the defined regex
 */
function verifyCity(ville) {
  let fieldIsCorrect = false;
  if (globalRegex.test(ville)) {
    fieldIsCorrect = true;
  } else {
    showErrorMsg("cityErrorMsg", "Town");
  }
  return fieldIsCorrect;
}
 
/*
 * Checks that the form field "email" matches the defined regex
 */
function verifyEmail(email) {
  let fieldIsCorrect = false;
  if (
    email.match(
      /[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,24}/
    )
  ) {
    fieldIsCorrect = true;
  } else {
    showErrorMsg("emailErrorMsg", "Email");
  }
  return fieldIsCorrect;
}
 
/*
 * Sends a request to the api containing all the information entered and redirects to the confirmation
 */
function sendRequestToApi(body) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status == 201) {
        return response.json();
      } else {
        console.error("an error occurred during the order");
      }
    })
    .then((order) => {
      localStorage.clear();
      id = order.orderId;
      window.location.href = `confirmation.html?id=${id}`;
    });
}
 
/*
 * Listen to the submit event then check the form fields and run the confirmation procedure
 */
addEventListener("submit", function (e) {
  e.preventDefault();
  let prenom = e.target.firstName.value;
  let nom = e.target.lastName.value;
  let adresse = e.target.address.value;
  let ville = e.target.city.value;
  let email = e.target.email.value;
  if (
    verifyFirstName(prenom) &&
    verifyLastName(nom) &&
    verifyAddress(adresse) &&
    verifyCity(ville) &&
    verifyEmail(email)
  ) {
    sendRequestToApi(createBodyRequest(prenom, nom, adresse, ville, email));
  } else {
    console.error("Not all fields are filled in correctly");
  }
});
 
/*
 * Create the send object in the body of the request
 */
function createBodyRequest(prenom, nom, adresse, ville, mail) {
  let idProducts = [];
  for (let i = 0; i < dataStorage.length; i++) {
    idProducts.push(dataStorage[i].id);
  }
  const bodyContent = {
    contact: {
      firstName: prenom,
      lastName: nom,
      address: adresse,
      city: ville,
      email: mail,
    },
    products: idProducts,
  };
  return bodyContent;
}
 
/* Global function retrieving the localStorage to display the products on the page*/
function displayProducts() {
  if (localStorage.length != 0) {
    for (let i = 0; i <= dataStorage.length - 1; i++) {
      createCardProduct(dataStorage[i]);
    }
  }
  totalRefresh();
}
 
displayProducts();