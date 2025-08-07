import { addToCart } from "./cart.js";

export function renderDishes(dishes) {
  const dishList = document.getElementById("dishList");
  if (!dishList || !Array.isArray(dishes)) return;

  dishList.innerHTML = dishes.map((dish, i) => `
    <section class="dish-card" data-index="${i}">
      <img 
        src="${dish.image}" 
        alt="${dish.name}" 
        onerror="this.src='fallback.jpg'" 
        loading="lazy"
      />
      <div class="dish-info">
        <h2>${dish.name}</h2>
        <p class="description">${dish.description}</p>
        <button class="order-btn" aria-label="Add ${dish.name} to cart">🍽️ Add to Order</button>
      </div>
    </section>
  `).join("");

  dishList.querySelectorAll(".order-btn").forEach((btn, i) => {
    btn.addEventListener("click", () => addToCart(dishes[i]));
  });
}
