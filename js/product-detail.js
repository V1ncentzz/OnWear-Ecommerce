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
      <div class="col-md-4">
        <img src="${item.images[0]}" class="img-fluid rounded-start" alt="${item.name}">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text text-muted mb-1">₱${item.price.toLocaleString()}</p>
          <p class="card-text"><small class="text-muted">${item.description}</small></p>
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