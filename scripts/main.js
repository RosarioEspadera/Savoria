import { renderDishes } from "./renderDishes.js";

fetch("./data/dishes.json")
  .then(res => res.ok ? res.json() : Promise.reject("Failed to load"))
  .then(dishes => renderDishes(dishes))
  .catch(err => console.error("Error loading dishes:", err));

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



