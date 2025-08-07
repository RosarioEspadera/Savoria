import { addToCart } from "./cart.js";

export function renderDishes(dishes) {
  const dishList = document.getElementById("dishList");
  if (!dishList) return;

  dishList.innerHTML = dishes.map((dish, i) => `
    <section class="dish-card" data-index="${i}">
      <img src="${dish.image}" alt="${dish.name}" onerror="this.src='fallback.jpg'" />
      <div class="dish-info">
        <h2>${dish.name}</h2>
        <p class="description">${dish.description}</p>
        <button class="order-btn">🍽️ Add to Order</button>
      </div>
    </section>
  `).join("");

  const cards = dishList.querySelectorAll(".dish-card");
  cards.forEach((card, i) => {
    const button = card.querySelector(".order-btn");
    button.addEventListener("click", () => addToCart(dishes[i]));
  });
}
