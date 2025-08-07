import { renderDishes } from "./renderDishes.js";

let allDishes = [];

export function setAllDishes(dishes) {
  allDishes = dishes;
}

export function filterDishes(keyword) {
  const query = keyword.trim().toLowerCase();

  if (!query) {
    renderDishes(allDishes);
    return;
  }

  const filtered = allDishes.filter(dish =>
    dish.name.toLowerCase().includes(query) ||
    dish.category.toLowerCase().includes(query) ||
    (dish.tags || []).some(tag => tag.toLowerCase().includes(query))
  );

  if (filtered.length === 0) {
    renderEmptyState(query);
  } else {
    renderDishes(filtered);
  }
}

function renderEmptyState(query) {
  const container = document.getElementById("menu-container");
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">
      <h2>No dishes found for “${query}”</h2>
      <p>Try another keyword or explore the full menu.</p>
    </div>
  `;
}
