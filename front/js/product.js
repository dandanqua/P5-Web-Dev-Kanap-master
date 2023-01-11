/*
 * Retrieves the product id from the page url
 */
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

/*
 * Retrieves product data from the api
 */
async function retrieveProductData() {
  return (await fetch(`http://localhost:3000/api/products/${id}`)).json();
}

/*
 * Calls the function to retrieve product information
 * Returns an error console if retrieval is not possible
 */
const getProductData = async () => {
  try {
    return retrieveProductData();
  } catch {
    console.error("Error retrieving product data");
  }
};

/*
 * Global function allowing the placement of different product information on the page
 */
const createProductItem = async () => {
  const product = await getProductData();
  createProductImg(product.imageUrl, product.altTxt);
  createProductTitle(product.name);
  createProductDescription(product.description);
  createProductPrice(product.price);
  createProductcolours(product.colors);
};

/*
 * Implementation of the image on the product page
 */
function createProductImg(image, altText) {
  const productItem = document.getElementsByClassName("item__img")[0];
  const productImg = document.createElement("img");
  productImg.src = image;
  productImg.alt = altText;

  productItem.appendChild(productImg);
}

/*
 * Implementation of the title on the product page
 */
function createProductTitle(title) {
  const productName = document.getElementById("title");
  const productTitle = document.getElementsByTagName("title")[0];
  productName.innerText = title;
  productTitle.innerText = title;
}

/*
 * Implementation of the price on the product page
 */
function createProductPrice(price) {
  const productPrice = document.getElementById("price");
  productPrice.innerText = price;
}

/*
 * Implementation of the description on the product page
 */
function createProductDescription(description) {
  const productDescription = document.getElementById("description");
  productDescription.innerText = description;
}

/*
 * Implementation of the colours on the product page
 */
function createProductcolours(colours) {
  const productcolours = document.getElementById("colors");
  for (i = 0; i <= colours.length - 1; i++) {
    const options = document.createElement("option");
    options.value = colours[`${i}`];
    options.innerHTML = colours[`${i}`];
    productcolours.appendChild(options);
  }
}

/*
 * Checking the compatibility of the browser with the LocalStorage
 */
function verifyCompatibility() {
  if (localStorage) {
    allSelectedOptions();
  } else {
    console.error(
      "Sorry, your browser does not support localStorage..."
    );
  }
}

/*
 * Checks that the necessary fields have been selected
 */
function allSelectedOptions() {
  const quantityChoose = parseInt(
    document.getElementById("quantity").value
  );
  const colours = document.getElementById("colors");
  const colourselected = colours.options[colours.selectedIndex].value;
  if (colourselected == "" || quantityChoose == 0) {
    console.error("All fields are mandatory");
    alert("please select a Color and a Valid Quantity")
  } else {
    addToCart(quantityChoose, colourselected);
    let confirmBox = confirm("do you want to continue to Cart?");
    if(confirmBox) {
      window.location.href ="../html/cart.html"
    }
    
  }
}

/*
 * Adding the selected product to the LocalStorage
 */
const addToCart = async (quantity, color) => {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let isExist = false;
  if (cart === null || cart === undefined) {
    cart = [];
  } else if (cart.find((item) => item.id === id && item.color == color)) {
    cart.map((obj) => {
      if (obj.id == id && obj.color == color) {
        obj.quantity += parseInt(quantity);
        isExist = true;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Updated quantity");
  }
  if (!isExist) {
    cart.push({
      id: id,
      quantity: quantity,
      color: color,
    });
    console.log("Product added to cart");
  }
  localStorage.setItem("cart", JSON.stringify(cart));
};

/*
 * Listening to the add to cart button
 */
const button = document.getElementById("addToCart");
button.addEventListener("click", verifyCompatibility);

createProductItem();