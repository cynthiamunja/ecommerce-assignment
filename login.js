async function loginPage() {
    const url = "http://localhost:3000/signup";
    const email = document.getElementById("login-email").value;
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
 
    if (username && email && password) {
        try {
            const response = await fetch(url);
            const users = await response.json();
 
            const userExists = users.some(user => user.username === username && user.email === email && user.password === password);
 
            if (userExists) {
                
                window.location.href = "index.html"; // Redirect to home page
            } else {
                alert("Failed to log in. Incorrect username, email, or password.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        }
    } else {
        alert("Please fill out all fields.");
    }
}
 