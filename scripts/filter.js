import { renderDishes } from "./renderDishes.js";

let allDishes = [];
let activeTags = [];

export function setAllDishes(dishes) {
  allDishes = dishes;
}

export function toggleTag(tag) {
  const index = activeTags.indexOf(tag);
  if (index > -1) {
    activeTags.splice(index, 1);
  } else {
    activeTags.push(tag);
  }
  applyFilters();
  updateTagButtonStates();
}

export function filterDishes(keyword) {
  const query = keyword.trim().toLowerCase();
  applyFilters(query);
}

function applyFilters(keyword = "") {
  const query = keyword.toLowerCase();

  let filtered = allDishes;

  if (activeTags.length > 0) {
    filtered = filtered.filter(dish =>
      dish.tags && activeTags.every(tag => dish.tags.includes(tag))
    );
  }

  if (query) {
    filtered = filtered.filter(dish =>
      dish.name.toLowerCase().includes(query) ||
      dish.category.toLowerCase().includes(query) ||
      (dish.tags || []).some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (filtered.length === 0) {
    renderEmptyState(query || activeTags.join(", "));
  } else {
    renderDishes(filtered);
  }
}

function updateTagButtonStates() {
  document.querySelectorAll(".tag-button").forEach(btn => {
    const tag = btn.textContent;
    btn.classList.toggle("active", activeTags.includes(tag));
  });
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
