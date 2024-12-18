// Function to fetch user info and update the UI
async function fetchUserInfo() {
    try {
        const response = await fetch("http://localhost:5000/currinfo");
        
        if (response.ok) {
            const data = await response.json();
            
            // Check if the username is present
            if (data.username) {
                // Display the username in the span
                const showNameSpan = document.getElementById("showname");
                showNameSpan.hidden=false;
                showNameSpan.textContent = ` ${data.username}`;
                
                // Hide "Sign In" and "Sign Up" links
                document.getElementById("signIn").style.display = "none";
                document.getElementById("signUp").style.display = "none";
                document.getElementById("logOut").hidden=false;
            }
        } else {
            console.error(`Error: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
}
document.addEventListener("DOMContentLoaded", fetchUserInfo);

document.getElementById("logOut").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default behavior of the link
  
    // Show the Sign In and Sign Up links
    document.getElementById("signIn").style.display = "inline";
    document.getElementById("signUp").style.display = "inline";
  
    // Hide the Log Out link
    document.getElementById("logOut").hidden = true;
  
    // Clear the showname span
    document.getElementById("showname").hidden = true;
  
    // Send a request to the server to clear data from the j1 table
    try {
      const response = await fetch("http://localhost:5000/currinfonull", {
        method: "POST", // Change the method based on your server setup
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        console.log("Data successfully removed from j1 table");
      } else {
        const error = await response.json();
        console.error("Failed to remove data:", error.message);
      }
    } catch (err) {
      console.error("An error occurred while clearing j1 table:", err.message);
    }
  
    console.log("User logged out");
  });
  