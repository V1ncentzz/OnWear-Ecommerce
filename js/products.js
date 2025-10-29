let products = [];
let filteredProducts = [];

//Fetch and display products filtered by brand
async function getProduct() {
  const params = new URLSearchParams(window.location.search);
  const brandActive = params.get('brand');

  if (brandActive) {
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.brand === brandActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const heading = document.querySelector(".h-text");
  if (brandActive && heading) {

      if (brandActive && heading) {
      switch (brandActive.toUpperCase()) {
        case "NIKE":
          heading.innerHTML = `<img src="images/Logo/NIKE.png" alt="NIKE" style="height:200px; object-fit:fill;">`;
          break;

        case "NEW BALANCE":
          heading.innerHTML = `<img src="images/Logo/NB.png" alt="New Balance" style="height:200px; object-fit:fill;">`;
          break;

        case "ADIDAS":
          heading.innerHTML = `<img src="images/Logo/ADIDAS.png" alt="Adidas" style="height:200px; object-fit:fill;">`;
          break;

        default:
          heading.textContent = "Product List";
          break;
      } 
    }
  }

  if (!brandActive) {
    document.getElementById("items").innerHTML = `<p class="text-center">No brand specified.</p>`;
    return;
  }

  try {
    const response = await fetch("data/products.json");
    products = await response.json();

    //Filter by brand from URL
    products = products.filter(p => p.brand.toLowerCase() === brandActive.toLowerCase());
    
    applyFilters();
  } catch (error) {
    console.error("Error fetching products:", error);
    document.getElementById("items").innerHTML = `<p class="text-center text-danger">Error loading products.</p>`;
  }
}

//Apply filters
function applyFilters() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const categoryFilter = document.getElementById('categoryFilter')?.value || '';
  const priceFilter = document.getElementById('priceFilter')?.value || '';

  filteredProducts = products.filter(product => {
    //Search filter
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm);

    //Category filter
    const matchesCategory = !categoryFilter || product.category === categoryFilter;

    //Price filter
    let matchesPrice = true;
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      matchesPrice = product.price >= min && product.price <= max;
    }

    return matchesSearch && matchesPrice && matchesCategory;
  });

  renderProducts();
}

//Render products
function renderProducts() {
  const itemsContainer = document.getElementById("items");

  if (filteredProducts.length === 0) {
    itemsContainer.innerHTML = `
      <div class="col-12">
        <div class="text-center py-5">
          <h3>No products found</h3>
          <p class="text-muted">Try adjusting your filters or search term</p>
        </div>
      </div>
    `;
    return;
  }

  const itemHTML = filteredProducts.map(product => `
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
  `).join('');

  itemsContainer.innerHTML = itemHTML;

  //Add click handlers
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

//Clear filters
function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('priceFilter').value = '';
  document.getElementById('categoryFilter').value = '';
  applyFilters();
}

//Event listeners
document.getElementById('searchInput')?.addEventListener('input', applyFilters);
document.getElementById('priceFilter')?.addEventListener('change', applyFilters);
document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
document.getElementById('clearFilters')?.addEventListener('click', clearFilters);

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