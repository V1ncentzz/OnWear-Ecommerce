let products = []

//Fetch and display products
async function getProduct() {
  const response = await fetch("data/products.json");
  products = await response.json();

  //Shuffle products randomly
  products.sort(() => Math.random() - 0.5);

  renderProducts();
}

function renderProducts() {

  const itemsContainer = document.getElementById("items");

  const itemHTML = products.map(product => `
    <div class="col">
      <div class="card h-100">
        <img src="${product.images[0]}" 
             class="card-img-top rounded mx-auto d-block" 
             alt="${product.name}" 
             style="height: 250px; object-fit: contain;">
        <div class="card-body text-center">
          <h6 class="text-uppercase text-muted">${product.brand || ''}</h6>
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text text-muted mb-2">₱${product.price.toLocaleString()}</p>
          <button class="btn btn-primary w-100 view-detail" data-id="${product.id}">View Details</button>
        </div>
      </div>
    </div>
  `).join("");

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
}

getProduct();

document.addEventListener("DOMContentLoaded", () => {
  const item = JSON.parse(localStorage.getItem("item"));
  const container = document.getElementById("product-container");

  if (!item) {
    container.innerHTML = "<p class='text-center'>No product details found.</p>";
    return;
  }

  //Render product details
  container.innerHTML = `
    <div class="row g-0">
      <div class="col-md-4 d-flex align-items-center container">
        <img src="${item.images[0]}" class="img-fluid rounded-start" width="500" height="500" alt="${item.name}">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title " style="font-size: 22px">${item.name}</h5>
          <p class="card-text text-muted mb-1">₱${item.price.toLocaleString()}</p>
          <p class="card-text" style="font-size: 16px">${item.description}</p>
          <button class="btn btn-primary mt-2" id="addToCartBtn">Add to Cart</button>
        </div>
      </div>
    </div>
  `;

  //Add to cart functionality
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(p => p.id === item.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
    alert(`${item.name} added to cart 🛒`);
  });

  //Handle brand navigation
  document.querySelectorAll('.nav-link[data-brand]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const brand = e.target.dataset.brand;
      window.location.href = `products.html?brand=${encodeURIComponent(brand)}`;
    });
  });

  //Initialize cart badge
  updateCartBadge();
});

//Update cart badge
function updateCartBadge() {
  const badge = document.getElementById("cartCountBadge");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  badge.textContent = cart.reduce((sum, p) => sum + (p.quantity || 1), 0);
}