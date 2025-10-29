document.addEventListener("DOMContentLoaded", () => {
  const orderItemsContainer = document.getElementById("orderItems");
  const subtotalElement = document.getElementById("subtotal");
  const shippingElement = document.getElementById("shipping");
  const orderTotalElement = document.getElementById("orderTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  const SHIPPING_FEE = 150;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  //Redirect if cart is empty
  if (cart.length === 0) {
    alert("Your cart is empty!");
    window.location.href = 'cart.html';
    return;
  }

  //Render order summary
  function renderOrderSummary() {
    const itemsHTML = cart.map(item => `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center">
          <img src="${item.images[0]}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain;" class="me-2">
          <div>
            <small class="d-block">${item.name}</small>
            <small class="text-muted">Qty: ${item.quantity}</small>
          </div>    
        </div>
        <span>₱${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('');

    orderItemsContainer.innerHTML = itemsHTML;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_FEE;

    subtotalElement.textContent = `₱${subtotal.toLocaleString()}`;
    shippingElement.textContent = `₱${SHIPPING_FEE.toLocaleString()}`;
    orderTotalElement.textContent = `₱${total.toLocaleString()}`;
  }

  //Handle form submission
  placeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //Validate form
    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    //Get form data
    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      province: document.getElementById("province").value,
      zipCode: document.getElementById("zipCode").value,
      paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };

    //Create order object
    const order = {
      orderNumber: 'ORD-' + Date.now(),
      date: new Date().toLocaleString(),
      customer: formData,
      items: cart,
      subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      shipping: SHIPPING_FEE,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + SHIPPING_FEE
    };

    //Store order in localStorage (in real app, send to backend)
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    //Clear cart
    localStorage.removeItem("cart");

    //Show success message
    alert(`Order placed successfully! \nOrder Number: ${order.orderNumber}\n\nThank you for shopping with OnWear! 🛍️`);

    //Redirect to home page
    window.location.href = 'index.html';
  });

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
    badge.textContent = cart.reduce((sum, p) => sum + (p.quantity || 1), 0);
  }

  //Initialize
  renderOrderSummary();
  updateCartBadge();
});