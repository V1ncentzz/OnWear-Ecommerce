document.addEventListener("DOMContentLoaded", () => {
  const item = JSON.parse(localStorage.getItem("item"));
  const container = document.getElementById("product-container");

  if (!item) {
    container.innerHTML = "<p>No product details found.</p>";
    return;
  }

  container.innerHTML = `
    <div class="row g-0">
      <div class="col-md-4">
        <img src="${item.images[0]}" class="img-fluid rounded-start" alt="${item.name}">
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text text-muted mb-1">₱${item.price}</p>
          <p class="card-text"><small class="text-muted">${item.description}</small></p>
          <button class="btn btn-primary mt-2" data-id="${item.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
});
