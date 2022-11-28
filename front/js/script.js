const ITEMS = document.getElementById("items");

/*
 * Retrieves the data from the API, then converts it to json
 */
function retrieveProductData() {
  fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
      implementData(data);
    })
    .catch((e) => {
      console.error("Error retrieving data from API");
    });
}

/*
 * For each item implement the data
 */
function implementData(data) {
  for (let item = 0; item < data.length; item++) {
    if (data[item]) {
      ITEMS.appendChild(createItem(data[item]));
    }
  }
}

/*
 * Calls the functions to set up the articles
 */
function createItem(data) {
  const articleProduct = createArticleProduct(data);
  const finalProduct = createLinkToProduct(data._id, articleProduct);

  return finalProduct;
}

/*
 * Creation of the article, which will contain the different elements
 */
function createArticleProduct(product) {
  const article = document.createElement("article");
  createImageProduct(product.imageUrl, product.altTxt, article);
  createTitleProduct(product.name, article);
  createDescriptionProduct(product.description, article);

  return article;
}

/*
 * Add the image corresponding to the article
 */
function createImageProduct(image, alt, article) {
  const element = document.createElement("img");
  element.setAttribute("src", image);
  element.setAttribute("alt", alt);
  article.appendChild(element);
}

/*
 * Add the title corresponding to the article
 */
function createTitleProduct(name, article) {
  const title = document.createElement("h3");
  title.classList.add("productName");
  title.innerText = name;
  article.appendChild(title);
}

/*
 * Add the description corresponding to the article
 */
function createDescriptionProduct(description, article) {
  const paragraph = document.createElement("p");
  paragraph.classList.add("productDescription");
  paragraph.textContent = description;
  article.appendChild(paragraph);
}

/*
 * Creation of the link to the associated product page via the id
 */
function createLinkToProduct(id, articleProduct) {
  const productLink = document.createElement("a");
  productLink.href = `./product.html?id=${id}`;
  productLink.appendChild(articleProduct);
  return productLink;
}

retrieveProductData();