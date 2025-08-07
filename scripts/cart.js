let cart = [];

export function addToCart(dish) {
  console.log("Added to cart:", dish.name);
  if (!isValidDish(dish)) {
    console.error("Invalid dish format:", dish);
    return;
  }

  const existing = cart.find(item => item.id === dish.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...dish, quantity: 1 });
    showToast(`🛒 ${dish.name} added to cart.`);
  }

  renderCart();
}

function isValidDish(dish) {
  return dish &&
    typeof dish.id === "string" &&
    typeof dish.name === "string" &&
    typeof dish.price === "number" &&
    Array.isArray(dish.tags);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

let dishes = [];

export async function loadDishes() {
  try {
    const res = await fetch('./data/dishes.json');
    const data = await res.json();
    dishes = data.categories.flatMap(cat => cat.items);
    renderCart();
  } catch (err) {
    console.error("Failed to load dishes:", err);
  }
}

function renderCart() {
  const cartPreview = document.getElementById('cartPreview');
  if (!cartPreview || dishes.length === 0) return;

  if (cart.length === 0) {
    cartPreview.innerHTML = `<p>Your cart is feeling poetic... but empty.</p>`;
    return;
  }

  const itemsHTML = cart.map((item, index) => {
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
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
  cartPreview.innerHTML = `
    <h2>Cart Preview</h2>
    ${itemsHTML}
    <div class="cart-total">Total: ₱${total.toFixed(2)}</div>
  `;
}

window.updateQuantity = function(id, newQty) {
  if (newQty < 1) return;
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity = newQty;
    renderCart();
  }
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  renderCart();
};

export function getCart() {
  return cart;
}
