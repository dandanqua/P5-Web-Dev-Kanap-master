// Retrieve the id transmitted in the links to perform a request with this one as a parameter
var actualUrl = document.location.href;
actualUrl = new URL(actualUrl);
var id = actualUrl.searchParams.get("id");

const url = "http://localhost:3000/api/products/" + id;

/**
 * Retrieve the article associated with the transmitted id to display the details later
 * @param { String } url
 * @return { Promise }
 **/
function ajax(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (article) {
      createItemPage(
        article.imageUrl,
        article.altTxt,
        article.name,
        article.price,
        article.description,
        article.colors
      );
      manageBasket(id, article.name);
    })
    .catch(function (err) {
      console.log(err);
    });
}
ajax(url);

/**
 * 
Filling of the article page with the information retrieved via the id entered
 * @param { String } imageUrl
 * @param { String } imageAlt
 * @param { String } name
 * @param { String } price
 * @param { String } description
 * @param { String } colors
 **/
function createItemPage(
  imageUrl,
  imageAlt,
  name,
  price,
  description,
  colors
) {
  //   edit page title
  document.title = name;

  //   added article image
  let item__img = document.getElementsByClassName("item__img");
  let pictureItem = document.createElement("img");
  pictureItem.src = imageUrl;
  pictureItem.alt = imageAlt;
  item__img[0].append(pictureItem);

  //  add article title
  document.getElementById("title").textContent = name;

  //   add item price
  document.getElementById("price").textContent = price;

  //   added item description
  document.getElementById("description").textContent = description;

  //   added available colors
  let colorSelector = document.getElementById("colors");

  for (let color of colors) {
    let optionColor = document.createElement("option");
    optionColor.value = color;
    optionColor.textContent = color;
    colorSelector.append(optionColor);
  }
}

// modal which notifies the user of the addition to the cart and can redirect him to the cart page
const popUpCart = (name) => {
  if (
    window.confirm(
      `You booked ${document.getElementById("quantity").value} ${name} ${
        document.getElementById("colors").value
      } To view your cart, click OK`
    )
  ) {
    window.location.href = "cart.html";
  }
};

/**
 * addition or update of the basket (id and name of the article)
 * @param { String } id
 * @param { String } name
 **/
function CartManagement(id, name) {
  // Adding the requested item to the basket
  document.getElementById("addToCart").addEventListener("click", (event) => {
    // Check that the quantity and color are filled in
    if (
      document.getElementById("quantity").value > 0 &&
      document.getElementById("quantity").value <= 100 &&
      document.getElementById("colors").value != ""
    ) {
      // retrieving the current localStorage
      let basket = JSON.parse(localStorage.getItem("kanapBasket"));

      // Creates a Json object including the info of the targeted article
      let article = {
        id: id,
        quantity: document.getElementById("quantity").value,
        colors: document.getElementById("colors").value,
      };

      // If the retrieved cart (localStorage) contains one or more items
      if (basket) {
        console.log("Cart containing content, I verify");

        // We search here among the items in the basket to retrieve if the one we want to add is already there
        const articlePresent = basket.find(
          (el) => el.id === article.id && el.colors === article.colors
        );

        if (articlePresent) {
          console.log(
            "Product found, so I don't add, I adjust the quantity"
          );
          articlePresent.quantity =
            parseInt(article.quantity) + parseInt(articlePresent.quantity);
          localStorage.setItem("kanapBasket", JSON.stringify(basket));
          popUpCart(name);
        } else {
          console.log("Product not found, so i add");
          basket.push(article);
          localStorage.setItem("kanapBasket", JSON.stringify(basket));
          popUpCart(name);
        }
      } else {
        console.log("Cart empty, so I'm adding");
        basket = [];
        basket.push(article);
        localStorage.setItem("kanapBasket", JSON.stringify(basket));
        popUpCart(name);
      }

      console.log(basket);
      console.log(localStorage);
    } else {
      alert("You must fill in the number of items and the color.");
    }
  });
}

// localStorage.clear();