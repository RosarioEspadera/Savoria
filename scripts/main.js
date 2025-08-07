import { loadAndRenderDishes } from "./renderDishes.js";
import { setAllDishes, filterDishes } from "./filter.js";

async function init() {
  try {
    const res = await fetch('./data/dishes.json');
    const data = await res.json();
    const all = data.categories.flatMap(cat => cat.items);
    setAllDishes(all);
    renderDishes(all);

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

init();
