import { renderDishes } from "./renderDishes.js";

const tagFilters = document.getElementById("tagFilters");

let allTags = [];

function createTagButton(tag) {
  const button = document.createElement("button");
  button.className = "tag-button";
  button.textContent = tag;
  button.onclick = () => filterByTag(tag);
  return button;
}

function renderTagFilters(dishes) {
  tagFilters.innerHTML = "";

  allTags = [...new Set(dishes.flatMap(dish => dish.tags))].sort();

  allTags.forEach(tag => {
    tagFilters.appendChild(createTagButton(tag));
  });

  const clearBtn = document.createElement("button");
  clearBtn.className = "tag-button clear";
  clearBtn.textContent = "❌ Clear Filter";
  clearBtn.onclick = () => renderDishes(dishes);
  tagFilters.appendChild(clearBtn);
}

function filterByTag(tag) {
  fetch("./data/dishes.json")
    .then(res => res.json())
    .then(dishes => {
      const filtered = dishes.filter(dish => dish.tags.includes(tag));
      renderDishes(filtered);
    });
}

fetch("./data/dishes.json")
  .then(res => res.json())
  .then(dishes => {
    renderTagFilters(dishes);
    renderDishes(dishes);
  });


