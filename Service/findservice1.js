document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:5000/getjobinfo")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("job-container");
      container.innerHTML = ""; // Clear existing content if any

      // Loop over the data and create a new card for each job
      data.forEach((job) => {
        const cardHTML = `
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
              <!-- Book Button -->
              <a href="book.html">
                <button style="padding: 5px;">Book</button>
              </a>
            </div>
            <ion-icon class="bookmark-icon" name="bookmark-outline"></ion-icon>
          </div>
        `;
        
        container.innerHTML += cardHTML; // Append the card to the container
      });
    })
    .catch((error) => console.error("Error fetching job data:", error));
});
