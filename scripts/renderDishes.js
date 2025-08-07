import { addToCart } from "./cart.js";


function groupDishesByCategory(dishes) {
  const categories = {};
  dishes.forEach(dish => {
    if (!categories[dish.category]) {
      categories[dish.category] = {
        background: dish.background || '',
        items: []
      };
    }
    categories[dish.category].items.push(dish);
  });
  return categories;
}


export async function loadAndRenderDishes() {
  try {
    const res = await fetch('./data/dishes.json');
    const data = await res.json();
    const container = document.getElementById('menu-container');
    if (!container) return;

    data.categories.forEach((category, catIndex) => {
      // Create category section with background
      const section = document.createElement('section');
      section.className = `category-section ${category.background}`;

      // Category title
      const title = document.createElement('h2');
      title.textContent = category.name;
      section.appendChild(title);

      // Dish cards
      category.items.forEach((dish, dishIndex) => {
        const card = document.createElement('div');
        card.className = 'dish-card';

        card.innerHTML = `
          <img src="${dish.image}" alt="${dish.name}" loading="lazy" />
          <div class="dish-info">
            <h3>${dish.name}</h3>
            <p class="price">₱${dish.price.toFixed(2)}</p>
            <button class="order-btn" data-cat="${catIndex}" data-index="${dishIndex}">
              🍽️ Add to Order
            </button>
          </div>
        `;

        section.appendChild(card);
      });

      container.appendChild(section);
    });

    // Attach cart listeners
    const buttons = container.querySelectorAll(".order-btn");
    buttons.forEach(btn => {
      const cat = parseInt(btn.dataset.cat, 10);
      const index = parseInt(btn.dataset.index, 10);
      const dish = data.categories[cat]?.items[index];
      if (dish) {
        btn.addEventListener("click", () => addToCart(dish));
      }
    });

  } catch (err) {
    console.error("Failed to load dishes:", err);
  }
}

loadAndRenderDishes();

export function renderDishes(dishes) {
  const container = document.getElementById('menu-container');
  if (!container) return;
  container.innerHTML = '';

  const categories = groupDishesByCategory(dishes);

  Object.entries(categories).forEach(([categoryName, category], catIndex) => {
    const section = document.createElement('section');
    section.className = `category-section ${category.background}`;

    const title = document.createElement('h2');
    title.textContent = categoryName;
    section.appendChild(title);

    category.items.forEach((dish, dishIndex) => {
      const card = document.createElement('div');
      card.className = 'dish-card';
      card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" loading="lazy" />
        <div class="dish-info">
          <h3>${dish.name}</h3>
          <p class="price">₱${dish.price.toFixed(2)}</p>
          <button class="order-btn" data-cat="${catIndex}" data-index="${dishIndex}">🍽️ Add to Order</button>
        </div>
      `;
      section.appendChild(card);
    });

    container.appendChild(section);
  });

  // Attach cart listeners
  const buttons = container.querySelectorAll(".order-btn");
  buttons.forEach(btn => {
    const cat = parseInt(btn.dataset.cat, 10);
    const index = parseInt(btn.dataset.index, 10);
    const dish = categories[Object.keys(categories)[cat]]?.items[index];
    if (dish) {
      btn.addEventListener("click", () => addToCart(dish));
    }
  });
}
