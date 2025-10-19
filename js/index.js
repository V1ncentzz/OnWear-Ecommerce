let currentPage = 1;
const itemsPerPage = 12;
let products = [];

async function getProduct() {
  const response = await fetch("/data/products.json");
  products = await response.json();

  products.sort(() => Math.random() - 0.5);

  const urlParams = new URLSearchParams(window.location.search);
  const brandFilter = urlParams.get("brand");

  if (brandFilter) {
    products = products.filter(p => p.brand?.toLowerCase() === brandFilter.toLowerCase());
  }

  renderProducts();
  renderPagination();
}

function renderProducts() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = products.slice(startIndex, endIndex);

  let itemHTML = "";

  if (paginatedItems.length === 0) {
    document.getElementById("items").innerHTML = `<p>No products found for this brand.</p>`;
    return;
  }

  paginatedItems.forEach(product => {
    itemHTML += `
      <div class="col-md-3 col-sm-6 mb-4">
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
    `;
  });

  document.getElementById("items").innerHTML = itemHTML;

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

function renderPagination() {
  const totalPages = Math.ceil(products.length / itemsPerPage);
  let paginationHTML = `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>
    `;
  }

  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
    </li>
  `;

  document.querySelector(".pagination").innerHTML = paginationHTML;
}

function changePage(page) {
  const totalPages = Math.ceil(products.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderProducts();
  renderPagination();
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener("click", (e) => { 
    const brand = e.target.dataset.brand; 
    window.location.href = `products.html?brand=${encodeURIComponent(brand)}`;
  }); 
});

getProduct();
