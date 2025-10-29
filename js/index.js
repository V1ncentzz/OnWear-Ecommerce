//Pagination and product display
let currentPage = 1;
const itemsPerPage = 12;
let products = [];

//Fetch and display products
async function getProduct() {
  const response = await fetch("/data/products.json");
  products = await response.json();

  //Shuffle products randomly
  products.sort(() => Math.random() - 0.5);

  //Filter by brand if specified in URL
  const urlParams = new URLSearchParams(window.location.search);
  const brandFilter = urlParams.get("brand");

  if (brandFilter) {
    products = products.filter(p => p.brand?.toLowerCase() === brandFilter.toLowerCase());
  }

  renderProducts();
  renderPagination();
}

//Render products for current page
function renderProducts() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = products.slice(startIndex, endIndex);

  const itemsContainer = document.getElementById("items");

  if (paginatedItems.length === 0) {
    itemsContainer.innerHTML = `<p class="text-center">No products found for this brand.</p>`;
    return;
  }

  const itemHTML = paginatedItems.map(product => `
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
}

//Render pagination controls
function renderPagination() {
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginationContainer = document.querySelector(".pagination");

  let paginationHTML = `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Previous</a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
      </li>
    `;
  }

  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Next</a>
    </li>
  `;

  paginationContainer.innerHTML = paginationHTML;
}

//Change to a different page
function changePage(page) {
  const totalPages = Math.ceil(products.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderProducts();
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
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