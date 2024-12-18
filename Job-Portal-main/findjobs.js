document.addEventListener("DOMContentLoaded", function () {
  // Initialize fetching user info
  fetchUserInfo();

  // Initialize the fetch and render job cards
  fetchJobData();

  // Add event listener for searching
  const searchInput = document.querySelector(".search input");
  const searchButton = document.querySelector(".btn-search");
  searchButton.addEventListener("click", searchJobs);
  searchInput.addEventListener("input", searchJobs);

  // Add event listener for sorting
  const sortSelect = document.querySelector(".sort-list select");
  sortSelect.addEventListener("change", sortJobs);

  // Add event listeners for filtering
  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", filterJobs);
  });
});

// Fetch user info and update the UI
async function fetchUserInfo() {
  try {
    const response = await fetch("http://localhost:5000/currinfo");

    if (response.ok) {
      const data = await response.json();

      // Check if the username is present
      if (data.username) {
        // Display the username in the span
        const showNameSpan = document.getElementById("showname");
        showNameSpan.hidden = false;
        showNameSpan.textContent = `${data.username}`;
        console.log("Username:", showNameSpan.textContent);
      }
    } else {
      console.error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
}

// Fetch job data from the server and render job cards
function fetchJobData() {
  fetch("http://localhost:5000/getjobinfo")
    .then((response) => response.json())
    .then((data) => {
      displayJobCards(data);
    })
    .catch((error) => console.error("Error fetching job data:", error));
}

// Display job cards in the container
function displayJobCards(jobs) {
  const container = document.getElementById("job-container");
  container.innerHTML = ""; // Clear previous content
  jobs.forEach((job) => {
    const cardHTML = createJobCardHTML(job);
    container.insertAdjacentHTML("beforeend", cardHTML);
  });
}

// Create job card HTML
function createJobCardHTML(job) {
  return `
    <div class="card">
       
      <div class="card-center">
        <h3>${job.companyName}</h3>
        <p class="card-detail">${job.position}</p>
        <p class="card-loc">
          <ion-icon name="location-outline"></ion-icon>${job.location}
        </p>
        <div class="card-sub">
          <p><ion-icon name="today-outline"></ion-icon>${new Date().toLocaleTimeString()}</p>
          <p><ion-icon name="hourglass-outline"></ion-icon>${job.employmentType}</p>
          <p><ion-icon name="people-outline"></ion-icon>${job.applicants} Applicants</p>
        </div>
      </div>
      <div class="card-right">
        <div class="card-tag">
          <h5>Division</h5>
          <a href="#">${job.position}</a>
        </div>
        <div class="card-salary">
          <p><b>${job.salary}</b>/Year</p>
        </div>
        <a href="../Test/index.html">
          <button style="padding: 5px;" onclick="fun(${job.companyName})">Apply</button>
        </a>
      </div>
      <ion-icon class="bookmark-icon" name="bookmark-outline"></ion-icon>
    </div>
  `;
}

// Search functionality
function searchJobs() {
  const searchInput = document.querySelector(".search input");
  const searchTerm = searchInput.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const cardTitle = card.querySelector("h3").textContent.toLowerCase();

    if (cardTitle.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Sort functionality
function sortJobs() {
  const sortSelect = document.querySelector(".sort-list select");
  const sortBy = parseInt(sortSelect.value);
  const container = document.getElementById("job-container");
  const cards = Array.from(document.querySelectorAll(".card"));

  if (sortBy === 1) {
    // Sort by lowest salary
    cards.sort((a, b) => {
      const salaryA = parseFloat(a.querySelector(".card-salary b").textContent.replace("$", ""));
      const salaryB = parseFloat(b.querySelector(".card-salary b").textContent.replace("$", ""));
      return salaryA - salaryB;
    });
  } else if (sortBy === 2) {
    // Sort by highest salary
    cards.sort((a, b) => {
      const salaryA = parseFloat(a.querySelector(".card-salary b").textContent.replace("$", ""));
      const salaryB = parseFloat(b.querySelector(".card-salary b").textContent.replace("$", ""));
      return salaryB - salaryA;
    });
  }

  // Clear and append sorted cards
  container.innerHTML = "";
  cards.forEach((card) => container.appendChild(card));
}

// Filter functionality
function filterJobs(event) {
  const selectedCategory = event.target.textContent.trim();
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const cardCategories = card.querySelector(".card-detail").textContent;
    const categoryArray = cardCategories.split(",");

    if (selectedCategory === "Show All" || categoryArray.includes(selectedCategory)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });


  // Function to send a fetch request to the /storeCompany endpoint
async function fun(companyName) {
  try {
    console.log(companyName);
      // Construct the URL with the companyName parameter
      const response = await fetch(`/storeCompany?companyName=${encodeURIComponent(companyName)}`, {
          method: 'GET', // Use GET method since we're passing data in the URL
          headers: {
              'Content-Type': 'application/json' // Set appropriate headers
          }
      });

      // Parse the response
      const result = await response.json();

      if (response.ok) {
          console.log("Response:", result);
      } else {
          console.error("Error:", result.message);
      }
  } catch (error) {
      console.error("Fetch Error:", error);
  }
}
 

}
