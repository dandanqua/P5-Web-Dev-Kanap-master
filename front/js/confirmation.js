// Retrieve the id transmitted in the links to display it
function getOrderId() {
  let actualUrl = document.location.href;
  actualUrl = new URL(actualUrl);
  let id = actualUrl.searchParams.get("id");

  // show order id in text
  document.getElementById("orderId").textContent = id;
}
getOrderId();