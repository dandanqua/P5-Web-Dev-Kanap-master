/**
 * Retrieve all the articles of the site according to the id in the basket to be able to display them later
 * @param { String } url
 * @return { Promise }
 **/
 function ajax(url, quantity, color) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (articles) {
      // console.log(articles);
      createBasketArticle(
        articles._id,
        articles.imageUrl,
        articles.altTxt,
        articles.name,
        color,
        articles.price,
        quantity
      );
    })
    .catch(function (err) {
      console.log(err);
    });
}

/* Retrieve all items from cart */
function showBasket() {
  // Recovery of localStorage (basket)
  let basket = JSON.parse(localStorage.getItem("kanapBasket"));

  // to avoid retrieving the article id several times, select several times
  let idBasket = [];
  for (let article of basket) {
    if (!idBasket.includes(article.id)) {
      idBasket.push(article);
    }
  }

  // Here, the table contains the ids in a single copy of each item in the basket
  for (let article of idBasket) {
    var url = "http://localhost:3000/api/products/" + article.id;
    ajax(url, article.quantity, article.colors);
  }
}
showBasket();

/**
 * Retrieve all articles from the site to be able to display them later
 * @param { String } imgSrc
 * @param { String } imgAlt
 * @param { String } name
 * @param { String } color
 * @param { String } price
 * @param { String } quantity
 **/
// Browse the cart retrieve and create an item for each item found
function createBasketArticle(id, imgSrc, imgAlt, name, color, price, quantity) {
  let cart__items = document.getElementById("cart__items");

  // article creation
  let articlePanier = document.createElement("article");
  articlePanier.classList.add("cart__item");
  articlePanier.dataset.id = id;
  articlePanier.dataset.color = color;
  cart__items.append(articlePanier);

  // creating the img div
  let cart__item__img = document.createElement("div");
  cart__item__img.classList.add("cart__item__img");
  articlePanier.append(cart__item__img);

  let img_cart__item__img = document.createElement("img");
  img_cart__item__img.src = imgSrc;
  img_cart__item__img.alt = imgAlt;
  cart__item__img.append(img_cart__item__img);

  // creating the content div
  let cart__item__content = document.createElement("div");
  cart__item__content.classList.add("cart__item__content");
  articlePanier.append(cart__item__content);

  // creating the content details subdiv
  let cart__item__content__description = document.createElement("div");
  cart__item__content__description.classList.add(
    "cart__item__content__description"
  );
  cart__item__content.append(cart__item__content__description);

  // Product title
  let content__description_titre = document.createElement("h2");
  content__description_titre.textContent = name;
  cart__item__content__description.append(content__description_titre);

  // product color
  let content__description_color = document.createElement("p");
  content__description_color.textContent = color;
  cart__item__content__description.append(content__description_color);

  // product price
  let content__description_price = document.createElement("p");
  content__description_price.textContent = price + " €";
  cart__item__content__description.append(content__description_price);

  // creating the content settings subdiv
  let cart__item__content__settings = document.createElement("div");
  cart__item__content__settings.classList.add("cart__item__content__settings");
  cart__item__content.append(cart__item__content__settings);

  // creating the quantity sub-subdiv
  let cart__item__content__settings__quantity = document.createElement("div");
  cart__item__content__settings__quantity.classList.add(
    "cart__item__content__settings__quantity"
  );
  cart__item__content__settings.append(cart__item__content__settings__quantity);

  // adding quantity
  let content__description_quantity = document.createElement("p");
  content__description_quantity.textContent = "Qté :";
  cart__item__content__settings__quantity.append(content__description_quantity);

  // adding quantity
  let content__description_quantity_input = document.createElement("input");
  content__description_quantity_input.type = "number";
  content__description_quantity_input.classList.add("itemQuantity");
  content__description_quantity_input.name = "itemQuantity";
  content__description_quantity_input.min = 1;
  content__description_quantity_input.max = 100;
  content__description_quantity_input.value = quantity;
  cart__item__content__settings__quantity.append(
  content__description_quantity_input
  );

  // creation of the sub-sub-div deletion
  let cart__item__content__settings__delete = document.createElement("div");
  cart__item__content__settings__delete.classList.add(
    "cart__item__content__settings__delete"
  );
  cart__item__content__settings.append(cart__item__content__settings__delete);

  // add call to delete
  let delete_btn = document.createElement("p");
  delete_btn.textContent = "Supprimer";
  delete_btn.classList.add("deleteItem");
  cart__item__content__settings__delete.append(delete_btn);
}

// request to the API to retrieve prices
function ajaxPrice(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (data) {
      // console.log(data.price);
      return data.price;
    })
    .catch(function (err) {
      console.log(err);
    });
}

// Calculation of the total number of articles and the total amount and addition in the DOM
function totalArticle() {
  // Recovery of localStorage (basket)
  let basket = JSON.parse(localStorage.getItem("kanapBasket"));

  let totalPrice = 0;
  let quantity = 0;
  for (let article of basket) {
    quantity = parseInt(quantity) + parseInt(article.quantity);

    let url = "http://localhost:3000/api/products/" + article.id;

    // request to the API to retrieve prices (which should not be stored on the client side
    fetch(url)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (data) {
        console.log(data.price * article.quantity);
        totalPrice = totalPrice + article.quantity * data.price;

        // modification of the value of the basket total
        document.getElementById("totalPrice").innerText = totalPrice;
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  // modification of the number of items in the basket
  document.getElementById("totalQuantity").innerText = quantity;
}
totalArticle();

// changing the quantity of an item
function modifQtyArticle() {
  var selectBtnsQty = document.getElementsByClassName("itemQuantity");
  for (let selectBtnQty of selectBtnsQty) {
    selectBtnQty.addEventListener("change", function () {
      // When changing quantity => retrieves the id of the item in question
      var modifQtyId = selectBtnQty.closest("article").dataset.id;
      console.log(modifQtyId);

      // Recovery of localStorage (basket)
      let basket = JSON.parse(localStorage.getItem("kanapBasket"));

      // Look for the line containing the sought id
      for (let i = 0; i < basket.length; i++) {
        if (basket[i].id == modifQtyId) {
          console.log(
            "I change the quantity of item number" +
              modifQtyId +
              " equal to " +
              basket[i].id
          );
          // modifies the quantity with that indicated in the input
          basket[i].quantity = selectBtnQty.value;
        }
      }

      // add the new array in the localStorage
      localStorage.setItem("kanapBasket", JSON.stringify(basket));

      console.log(localStorage);

      // update the total
      totalArticle();
    });
  }
}

// deleting an item from the basket
function supprArticle() {
  var deleteBtns = document.getElementsByClassName(
    "cart__item__content__settings__delete"
  );

  for (let deleteBtn of deleteBtns) {
    // When clicking on the delete btn => retrieves the id of the article in question
    deleteBtn.addEventListener("click", function () {
      var deleteId = deleteBtn.closest("article").dataset.id;

      //Recovery of localStorage (basket)
      let basket = JSON.parse(localStorage.getItem("kanapBasket"));

      // Look for the line containing the sought id
      for (let i = 0; i < basket.length; i++) {
        if (basket[i].id == deleteId) {
          console.log(
            "I delete the article " + deleteId + " equal to" + basket[i].id
          );
          delete basket[i];
        }
      }

      // delete deletes the line concerned but leaves an "empty/null" line. It must therefore be deleted
      var basketFilter = basket.filter(function (e) {
        return e != null;
      });
      basket = basketFilter;

      // add the new array in the localStorage
      localStorage.setItem("kanapBasket", JSON.stringify(basket));

      // delete the concerned article from the DOM
      deleteBtn.closest("article").remove();

      // update the total
      totalArticle();
    });
  }
}

// Wait for the addition of el in the DOM before retrieving the list of deleted btns
window.onload = function () {
  modifQtyArticle();
  supprArticle();
};

// verification of data entered in the form
function formTreatment() {
  let form = document.querySelector(".cart__order__form");

  // Regular expression to filter the email address
  const RegExpText = /^[a-zA-Zàâäéèêëïîôöùûüç\-]+$/;
  const RegExpAdress = /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/;
  const RegExpEmail =
    /^(([^<()[\]\\.,;:\s@\]+(\.[^<()[\]\\.,;:\s@\]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

  // These variables are the respective validation flags of each entry, we initialize these values ​​to false
  var firstNameValid = false;
  var lastNameValid = false;
  var addressValid = false;
  var cityValid = false;
  var emailValid = false;

  // Listening to the modification and verification of the first name
  form.firstName.addEventListener("change", function () {
    if (form.firstName.value.match(RegExpText)) {
      document.getElementById("firstNameErrorMsg").textContent = "";
      firstNameValid = true;
    } else {
      document.getElementById("firstNameErrorMsg").textContent =
        "Invalid input type";
      firstNameValid = false;
    }
  });

  // Listening to the change and verifying the name
  form.lastName.addEventListener("change", function () {
    if (form.lastName.value.match(RegExpText)) {
      document.getElementById("lastNameErrorMsg").textContent = "";
      lastNameValid = true;
    } else {
      document.getElementById("lastNameErrorMsg").textContent =
        "Invalid input type";
      lastNameValid = false;
    }
  });

  // Listening to the modification and verification of the address
  form.address.addEventListener("change", function () {
    if (form.address.value.match(RegExpAdress)) {
      document.getElementById("addressErrorMsg").textContent = "";
      addressValid = true;
    } else {
      document.getElementById("addressErrorMsg").textContent =
        "Invalid input type";
      addressValid = false;
    }
  });

  // Listening to the modification and verifying the city
  form.city.addEventListener("change", function () {
    if (form.city.value.match(RegExpText)) {
      document.getElementById("cityErrorMsg").textContent = "";
      cityValid = true;
    } else {
      document.getElementById("cityErrorMsg").textContent =
        "Invalid input type";
      cityValid = false;
    }
  });

  // Listening to the change and verifying the e-mail address
  form.email.addEventListener("change", function () {
    if (form.email.value.match(RegExpEmail)) {
      document.getElementById("emailErrorMsg").textContent = "";
      emailValid = true;
    } else {
      document.getElementById("emailErrorMsg").textContent =
        "Invalid input type";
      emailValid = false;
    }
  });
// Finally, we check that all our verification flags are true
// If yes, we trigger the sending of the form
  form.addEventListener("change", function () {
    if (
      firstNameValid == true &&
      lastNameValid == true &&
      addressValid == true &&
      cityValid == true &&
      emailValid == true
    ) {
      console.log("complete form");
      getForm();
    } else {
      console.log("incomplete form");
    }
  });
}
formTreatment();

// send product ids contact to API
function getForm() {
  document
    .querySelector(".cart__order__form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      // We retrieve the list of product ids from the basket
      //Recovery of localStorage (basket)
      let basket = JSON.parse(localStorage.getItem("kanapBasket"));

      // to avoid retrieving the article id several times, select several times
      let idBasket = [];
      for (let article of basket) {
        if (!idBasket.includes(article.id)) {
          idBasket.push(article.id);
        }
      }

      // We create the contact and product objects required for sending to the API
      const order = {
        contact: {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        },
        products: idBasket,
      };

      //now, we will send our contact object and products to the API

      // define the parameters of our request
      const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      // request sending the contact object and the list of product ids. The API returns in exchange the order id
      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Once we have our order id, we redirect to the confirmation page with this one in the link
          document.location.href = "confirmation.html?id=" + data.orderId;
        })
        .catch((err) => {
          console.log("Problem with fetch : " + err.message);
        });
    });
}
