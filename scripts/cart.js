let cart = [];

export function addToCart(dish) {
  if (
    !dish ||
    typeof dish.id !== "string" ||
    typeof dish.name !== "string" ||
    typeof dish.price !== "number" ||
    typeof dish.description !== "string" ||
    !Array.isArray(dish.tags)
  ) {
    console.error("Invalid dish format:", dish);
    return;
  }

  // Add quantity if missing
  const existing = cart.find(item => item.id === dish.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...dish, quantity: 1 });
    showToast(`🛒 ${dish.name} added to cart.`);
  }
  
  renderCart();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}


let dishes = [];

async function loadDishes() {
  const res = await fetch('./data/dishes.json');
  dishes = await res.json();
  renderCart(); // call after dishes are loaded
}

function renderCart() {
  const cartPreview = document.getElementById('cartPreview');
  if (!cartPreview || dishes.length === 0) return;
   
  if (cart.length === 0) {
    cartPreview.innerHTML = `<p>Your cart is feeling poetic... but empty.</p>`;
    return;
  }

  const itemsHTML = cart.map((item, index) => {
    const dish = dishes.find(d => d.id === item.id);
    if (!dish) return '';

    return `
      <div class="cart-item">
        <img src="${dish.image}" alt="${dish.name}" />
        <div class="cart-item-details">
          <div class="cart-item-name">${dish.name}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
          <div class="cart-item-price">₱${(item.price * item.quantity).toFixed(2)}</div>
          <button class="remove-btn" onclick="removeFromCart(${index})">✖</button>
        </div>
      </div>
    `;
  }).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalFormatted = formatTotal(total);

  cartPreview.innerHTML = `
    <h2>Cart Preview</h2>
    ${itemsHTML}
    <div class="cart-total">Total: ${totalFormatted}</div>
  `;
}

function formatTotal(amount) {
  return '₱' + amount.toFixed(2);
}


window.updateQuantity = function(id, newQty) {
  if (newQty < 1) return;
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = newQty;
    renderCart();
  }
};

// Optional: allow item removal
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  renderCart();
};


// Optional: expose cart for email.js or orderForm
export function getCart() {
  return cart;
}

loadDishes();
