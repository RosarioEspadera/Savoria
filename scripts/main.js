import { loadAndRenderDishes, renderDishes } from "./renderDishes.js";
import { setAllDishes, toggleTag, filterDishes } from "./filter.js";

function extractUniqueTags(dishes) {
  const tagSet = new Set();
  dishes.forEach(dish => {
    (dish.tags || []).forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet);
}

function renderTagFilters(tags) {
  const container = document.getElementById("tagFilters");
  if (!container) return;

  container.innerHTML = '';
  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "tag-button";
    btn.textContent = tag;
    btn.addEventListener("click", () => toggleTag(tag));
    container.appendChild(btn);
  });
}

export async function initMenu() {
  try {
    const res = await fetch('./data/dishes.json');
    const data = await res.json();
    const all = data.categories.flatMap(cat => cat.items);

    setAllDishes(all);
    renderDishes(all);

    const tags = extractUniqueTags(all);
    renderTagFilters(tags);

    const searchInput = document.getElementById("search");
    if (searchInput) {
      searchInput.addEventListener("input", e => {
        filterDishes(e.target.value);
      });
    }
  } catch (err) {
    console.error("Failed to initialize menu:", err);
  }
}

initMenu();

// Cart sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
  const viewCartButton = document.querySelector('.view-cart-btn');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.getElementById('mainContent');

  if (viewCartButton && sidebar && mainContent) {
    viewCartButton.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      mainContent.classList.toggle('shifted');
    });
  }
});
