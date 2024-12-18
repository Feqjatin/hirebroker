const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
 

// Toggle between Sign Up and Sign In
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Helper function to display alerts
const showAlert = (message, type = "success") => {
  alert(`[${type.toUpperCase()}] ${message}`);
};

// Sign Up Form Submission
document.querySelector(".sign-up form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.querySelector(".sign-up input[placeholder='Name']").value.trim();
  const email = document.querySelector(".sign-up input[placeholder='Email']").value.trim();
  const password = document.querySelector(".sign-up input[placeholder='Password']").value.trim();

  if (!name || !email || !password) {
    showAlert("All fields are required!", "error");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      showAlert(result.message);
      container.classList.remove("active");
    } else {
      showAlert(result.message, "error");
    }
  } catch (error) {
    showAlert("Something went wrong. Please try again.", "error");
  }
});

document.querySelector(".sign-in form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector(".sign-in input[placeholder='Email']").value.trim();
  const password = document.querySelector(".sign-in input[placeholder='Password']").value.trim();

  if (!email || !password) {
    showAlert("All fields are required!", "error");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      showAlert(result.message);
      // Redirect to index.html
      window.location.href = "index.html";
    } else {
      showAlert(result.message, "error");
    }
  } catch (error) {
    showAlert("Something went wrong. Please try again.", "error");
  }
});
