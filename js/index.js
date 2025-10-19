// let items = fetch("/data/products.json").then(rawData => rawData.json())

let currentPage = 1;
const itemsPerPage = 12;
let products = [];

async function getProduct() {
  const response = await fetch("/data/products.json");
  products = await response.json();

  // Shuffle or randomize products by ID
  products.sort(() => Math.random() - 0.5);

  renderProducts();
  renderPagination();
}

function renderProducts() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = products.slice(startIndex, endIndex);

  let itemHTML = "";

  if (paginatedItems.length === 0) {
    document.getElementById("items").innerHTML = `<p>No products found.</p>`;
    return;
  }

  paginatedItems.forEach(product => {
    itemHTML += `
      <div class="col-md-3 col-sm-6 mb-4">
        <div class="card h-100">
          <img src="${product.images[0]}" class="card-img-top" alt="${product.name}" />
          <div class="card-body text-center">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-muted">₱${product.price}</p>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("items").innerHTML = itemHTML;
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

getProduct();


// async function getProduct() {
//     const response = await fetch("/data/products.json");
//     const products = await response.json();

//     let item = "";

//     const shuffled = [...products].sort(() => Math.random() - 0.5);

//     if (!products || products.length === 0) {
//       document.getElementById("items").innerHTML = `<p>No products found.</p>`;
//       return;
//     }

//     shuffled.forEach(product => {
//       item += `
//         <div class="col">
//           <div class="card shadow-sm">
//             <img src="${product.images[0]}" class="card-img-top" alt="${product.name}" />
//             <div class="card-body">
//               <h5 class="card-title">${product.name}</h5>
//               <p class="card-text text-muted mb-1">₱${product.price || "N/A"}</p>
//             </div>
//           </div>
//         </div>
//       `;
//     });

//     document.getElementById("items").innerHTML = item;
//   }

// getProduct()

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener("click", (e) => {
    const brand = e.target.dataset.brand; // e.g. "NIKE"
    window.location.href = `products.html?brand=${encodeURIComponent(brand)}`;
  });
});

