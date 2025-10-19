
async function getProduct() {
  const params = new URLSearchParams(window.location.search);
  const brandActive = params.get('brand');

  const response = await fetch("/data/products.json");
  const products = await response.json();

  console.log("brandActive:", brandActive);
  console.log("products:", products);

  let item = "";

  const items = products.filter(p => p.brand.toLowerCase() === brandActive.toLowerCase());

  if (items.length === 0) {
    document.getElementById("items").innerHTML = `<p>No products found for ${brandActive}</p>`;
    return;
  }

  items.forEach(product => {
    item += `
      <div class="col">
        <div class="card">
          <img src="${product.images[0]}" class="card-img-top" alt="${product.name}" />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class=
            <p class="card-text"><medium class="text-muted">₱${product.price || ""}</p>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("items").innerHTML = item;
}

getProduct();


