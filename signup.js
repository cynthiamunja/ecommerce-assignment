async function signupPage() {
    const url = "http://localhost:3000/signup";
    const email = document.getElementById("signup-email").value;
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
 
    if (username && email && password) {
        try {
            const response = await fetch(url);
            const users = await response.json();
 
            const userExists = users.some(user => user.username === username || user.email === email);
 
            if (userExists) {
                alert("Username or email already exists. Please choose another one.");
            } else {
                const user = {
                    email: email,
                    username: username,
                    password: password
                };
 
                const postResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                });
 
                if (postResponse.ok) {
                    alert("Signup successful! You can now login.");
                    window.location.href = "login.html"; // Redirect to login page
                } else {
                    alert("Failed to sign up. Please try again.");
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        }
    } else {
        alert("Please fill out all fields.");
    }
}