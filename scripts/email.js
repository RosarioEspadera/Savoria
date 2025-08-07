import { getCart } from "./cart.js";

emailjs.init("AqvkFhQnxowOJda9J");  

document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const cart = getCart();

  const data = {
    to_name: form.name.value,
    reply_to: form.email.value,
    address: form.address.value,
    item_list: generateItemListText(cart),
    total: formatTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0)),
  };

  try {
    await emailjs.send("service_epydqmi", "template_vzuexod", data);
    alert("🌟 Order sent! Check your inbox for a poetic receipt.");
    form.reset();
  } catch (err) {
    console.error("EmailJS error:", err);
    alert("⚠️ Something went wrong. Please try again.");
  }
});

function generateItemListText(cart) {
  return cart.map(item =>
    `${item.quantity} × ${item.name} — ₱${(item.price * item.quantity).toFixed(2)}`
  ).join("\n");
}

function formatTotal(amount) {
  return `₱${amount.toFixed(2)}`;
}
