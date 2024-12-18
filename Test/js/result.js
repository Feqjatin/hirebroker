window.onload = function () {
  const studentName = localStorage.getItem("studentName");
  const studentID = localStorage.getItem("studentID");
  const studentScore = localStorage.getItem("studentScore");

  if (studentName && studentID && studentScore) {
    document.getElementById("studentName").textContent = studentName;
    document.getElementById("studentID").textContent = studentID;
    document.getElementById("studentScore").textContent = `${studentScore}%`;
  } else {
    document.getElementById("studentName").textContent = "Not Available";
    document.getElementById("studentID").textContent = "Not Available";
    document.getElementById("studentScore").textContent = "Not Available";
  }

  // Function to send a fetch request to the /storeCompany endpoint
async function fun(companyName) {
  try {
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

// Example usage
sendCompanyName("ABC Corporation");

};
