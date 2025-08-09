import { supabase } from "./supabase.js";

function validatePasswords() {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const errorMessage = document.getElementById('errorMessage');

      if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        errorMessage.classList.add("error-animate");
        setTimeout(() => errorMessage.classList.remove("error-animate"), 400);
        return false; // Prevent form submission
      }

      errorMessage.textContent = ""; // Clear error message
      return true; // Allow form submission
    }

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  if (!validatePasswords()) return;

  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value);
  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

const { data, error } = await supabase.auth.signUp({ email, password });

if (error) {
  errorMsg.textContent = error.message;
  return;
}

const userId = data.user?.id;
if (userId) {
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    name,
    age,
    address,
    email
  });

  if (profileError) {
    errorMsg.textContent = profileError.message;
    return;
  }

  window.location.href = 'login.html';
  return;
}
});
