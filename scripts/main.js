import { loadAndRenderDishes } from "./renderDishes.js";


document.addEventListener('DOMContentLoaded', () => {
  loadAndRenderDishes(); // fetches and renders dishes

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
