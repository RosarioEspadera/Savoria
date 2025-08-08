import { addToCart } from "./cart.js";

// Create a single dish card
function createDishCard(dish, dishIndex) {
  const card = document.createElement('div');
  const categoryClass = dish.category
    ? `category-${dish.category.toLowerCase().replace(/\s+/g, '-')}`
    : 'category-unknown';
  card.classList.add("dish-card", categoryClass);

  card.innerHTML = `
    <img src="${dish.image}" alt="${dish.name}" loading="lazy" />
    <div class="dish-info">
      <h3>${dish.name}</h3>
      <p class="price">₱${dish.price.toFixed(2)}</p>
      <button class="order-btn" data-index="${dishIndex}">
        🍽️ Add to Order
      </button>
    </div>
  `;
  return card;
}

// Attach cart listeners
function attachCartListeners(container, dishes) {
  const buttons = container.querySelectorAll(".order-btn");
  buttons.forEach(btn => {
    const index = parseInt(btn.dataset.index, 10);
    const dish = dishes[index];
    if (dish) {
      btn.addEventListener("click", () => addToCart(dish));
    }
  });
}

// Render dishes from flat array
export function renderDishes(dishes) {
  const container = document.getElementById('menu-container');
  if (!container) return;
  container.innerHTML = '';

  dishes.forEach((dish, index) => {
    const card = createDishCard(dish, index);
    container.appendChild(card);
  });

  attachCartListeners(container, dishes);
}

// Load JSON and render
export async function loadAndRenderDishes() {
  try {
    const res = await fetch('./data/dishes.json');
    const data = await res.json();
    const allDishes = data.categories.flatMap(cat => cat.items);
    renderDishes(allDishes);
  } catch (err) {
    console.error("Failed to load dishes:", err);
  }
}

loadAndRenderDishes();
