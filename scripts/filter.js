import { loadAndRenderDishes, renderDishes } from "./renderDishes.js";



const tagFilters = document.getElementById("tagFilters");
let allTags = [];

function createTagButton(tag, isClear = false) {
  const button = document.createElement("button");
  button.className = `tag-button${isClear ? " clear" : ""}`;
  button.textContent = isClear ? "❌ Clear Filter" : tag;
  button.onclick = () => {
    if (isClear) {
      loadDishes(); // reset to full menu
    } else {
      filterByTag(tag);
    }
  };
  return button;
}

function renderTagFilters(dishes) {
  if (!tagFilters || !Array.isArray(dishes)) return;

  tagFilters.innerHTML = "";
  allTags = [...new Set(dishes.flatMap(d => d.tags))].sort();

  allTags.forEach(tag => tagFilters.appendChild(createTagButton(tag)));
  tagFilters.appendChild(createTagButton(null, true)); // clear button
}

function filterByTag(tag) {
  fetch("./data/dishes.json")
  .then(res => res.json())
  .then(data => {
    const dishes = data.categories.flatMap(cat => cat.items);
    const filtered = dishes.filter(d => d.tags.includes(tag));
    renderDishes(filtered);
  });
}

function loadDishes() {
 fetch("./data/dishes.json")
  .then(res => res.json())
  .then(data => {
    const dishes = data.categories.flatMap(cat => cat.items);
    renderTagFilters(dishes);
    renderDishes(dishes);
  });
}

loadDishes();
