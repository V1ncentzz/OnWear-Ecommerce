//Fetch and display products filtered by brand
async function getProduct() {
  const params = new URLSearchParams(window.location.search);
  const brandActive = params.get('brand');

  if (!brandActive) {
    document.getElementById("items").innerHTML = `<p class="text-center">No brand specified.</p>`;
    return;
  }

  try {
    const response = await fetch("/data/products.json");
    const products = await response.json();

    const items = products.filter(p => p.brand.toLowerCase() === brandActive.toLowerCase());

    const itemsContainer = document.getElementById("items");

    if (items.length === 0) {
      itemsContainer.innerHTML = `<p class="text-center">No products found for ${brandActive}.</p>`;
      return;
    }

    const itemHTML = items.map(product => `
      <div class="col">
        <div class="card h-100">
          <img src="${product.images[0]}" 
               class="card-img-top rounded mx-auto d-block" 
               alt="${product.name}" 
               style="height: 250px; object-fit: contain;">
          <div class="card-body text-center">
            <h6 class="text-uppercase text-muted">${product.brand || ''}</h6>
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-muted mb-2">₱${product.price}</p>
            <button class="btn btn-primary w-100 view-detail" data-id="${product.id}">View Details</button>
          </div>
        </div>
      </div>
    `).join('');

    itemsContainer.innerHTML = itemHTML;

    //Add click handlers to view detail buttons
    document.querySelectorAll(".view-detail").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        const productData = products.find(p => p.id == id);
        if (productData) {
          localStorage.setItem("item", JSON.stringify(productData));
          window.location.href = `product-detail.html?id=${id}`;
        }
      });
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    document.getElementById("items").innerHTML = `<p class="text-center text-danger">Error loading products.</p>`;
  }
}

//Handle brand navigation
document.querySelectorAll('.nav-link[data-brand]').forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const brand = e.target.dataset.brand;
    window.location.href = `products.html?brand=${encodeURIComponent(brand)}`;
  });
});

//Update cart badge
function updateCartBadge() {
  const badge = document.getElementById("cartCountBadge");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  badge.textContent = cart.reduce((sum, p) => sum + (p.quantity || 1), 0);
}

//Initialize
getProduct();
updateCartBadge();