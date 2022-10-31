/**  Retrieve all articles from the site to be able to display them later
 * @param { String } url
 * @return { Promise }
 **/

const url = "http://localhost:3000/api/products";

function ajax(url) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (articles) {
      //   console.log(articles);
      for (let article of articles) {
        displaySofaInHome(
          article._id,
          article.imageUrl,
          article.altTxt,
          article.name,
          article.description
        );
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}
ajax(url);

/**
 * Creation of an article for each result of the asynchronous javascript and XMLrequest on the home page
 * @param { String } idItem
 * @param { String } imageUrl
 * @param { String } imageAlt
 * @param { String } name
 * @param { String } description
 **/
function displaySofaInHome(idItem, imageUrl, imageAlt, name, description) {
  var items = document.getElementById("items");

  //   creation of article links
  let linkItem = document.createElement("a");
  linkItem.href = "product.html?id=" + idItem;
  items.append(linkItem);

  //   creating the article 
  let articleItem = document.createElement("article");
  linkItem.append(articleItem);

  //   creating the article images
  let pictureItem = document.createElement("img");
  pictureItem.src = imageUrl;
  pictureItem.alt = imageAlt;
  articleItem.append(pictureItem);

  //   creating the article title 
  let titleItem = document.createElement("h3");
  titleItem.textContent = name;
  titleItem.classList.add("productName");
  articleItem.append(titleItem);

  //   creating the article description
  let descriptionItem = document.createElement("p");
  descriptionItem.textContent = description;
  descriptionItem.classList.add("productDescription");
  articleItem.append(descriptionItem);
}
