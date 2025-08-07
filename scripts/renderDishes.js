import { addToCart } from "./cart.js";

export function renderDishes(dishes) {
  const dishList = document.getElementById("dishList");
  if (!dishList || !Array.isArray(dishes)) return;

  dishList.innerHTML = dishes.map((dish, i) => `
    <section class="dish-card" data-index="${i}">
      <img src="${dish.image}" alt="${dish.name}" loading="lazy" />
      <div class="dish-info">
        <h2>${dish.name}</h2>
        <p class="price">₱${dish.price.toFixed(2)}</p>
        <button class="order-btn" data-index="${i}">
          🍽️ Add to Order
        </button>
      </div>
    </section>
  `).join("");

  // Attach listeners AFTER rendering
  const buttons = dishList.querySelectorAll(".order-btn");
  buttons.forEach(btn => {
    const index = parseInt(btn.dataset.index, 10);
    btn.addEventListener("click", () => {
      const dish = dishes[index];
      if (dish) addToCart(dish);
    });
  });
}
