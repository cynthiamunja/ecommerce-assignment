// Signup function
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
 
// Login function
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
 
let products = [];
 
 
const addProductButton = document.getElementById('btn');
const inputTitle = document.getElementById('product');
const inputImage = document.getElementById('image-url');
const inputPrice = document.getElementById('price');
const inputQuantity = document.getElementById('quantity');
const urlProduct = "http://localhost:3000/products";
const urlcart = "http://localhost:3000/cart";
const urlcheckout="http://localhost:3000/checkout"
 
addProductButton.addEventListener('click', addProduct);
 
//function generateRandomId(length) {
  //  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //let randomId = '';
    //for (let i = 0; i < length; i++) {
     //   randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    //}
    //return randomId;
//}
 
 
//const randomId = generateRandomId(4); // Generates an 8-character random ID
 
 
async function addProduct() {
    if (inputImage.value === '' || inputPrice.value === '' || inputQuantity.value === '' || inputTitle.value === '') {
        return;
    }
 
    let newProduct = {
 
        id: Math.ceil(Math.random() * 1000),
        title: inputTitle.value,
        image: inputImage.value,
        quantity: parseInt(inputQuantity.value),
        price: parseFloat(inputPrice.value),
    };
 
    try {
        const response = await fetch(urlProduct, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });
 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
 
        products.push(newProduct);
        displayProducts(products);
        clearInputs();
    } catch (error) {
        console.error('Error adding product:', error);
    }
}
 
function clearInputs() {
    inputTitle.value = '';
    inputImage.value = '';
    inputPrice.value = '';
    inputQuantity.value = '';
}
 
async function getProducts() {
    try {
        const response = await fetch(urlProduct);
        const items = await response.json();
        products = items;
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
 
getProducts();
 
const productContainer = document.getElementById('root');
 
function displayProducts(items) {
    productContainer.innerHTML = '';
    items.forEach(product => {
        let productDiv = document.createElement('div');
        productDiv.classList.add('animals');
        productDiv.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p> available:  ${product.quantity}</p>
            <p>Price: $${product.price}</p>
            <button class="addtocart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productDiv);
    });
}
 
let cart = [];
 
async function addToCart(productId) {
    console.log('Products:', products); // Debugging line
    console.log('ProductId:', productId); // Debugging line
 
    const selectedProduct = products.find(prod => prod.id === productId);
 
    if (selectedProduct) {
        const { id, title, image, price } = selectedProduct;
        let newCartItem = {
            id: id.toString(),
            title: title,
            image: image,
            quantity: 1, // Set initial quantity to 1
            price: price
        };
 
        // Check if the item already exists in the cart
        const existingCartItem = cart.find(item => item.id === newCartItem.id);
        if (existingCartItem) {
            existingCartItem.quantity += 1;
            // Update quantity in the JSON data
            await fetch(`${urlcart}/${existingCartItem.id}`, {
                method: "PUT",
                body: JSON.stringify(existingCartItem),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            cart.push(newCartItem);
            const response = await fetch(urlcart, {
                method: "POST",
                body: JSON.stringify(newCartItem),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
 
            if (!response.ok) {
                console.error('Error adding to cart:', response.statusText);
            }
        }
        updateCart();
    } else {
        console.error('Selected product not found');
    }
}
 
async function getCartItems() {
    try {
        const response = await fetch(urlcart);
        const insideCart = await response.json();
        cart = insideCart;
        updateCart();
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}
 
getCartItems();
 
const cartContainer = document.getElementById('cartItem');
 
function updateCart() {
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        let cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cartDivision');
        cartItemDiv.innerHTML = `
            <img class="item" src="${item.image}" alt="${item.title}" />
            <h3>${item.title}</h3>
            <p>Price: $${item.price}</p>
            <label>Quantity:</label>
            <input class="input" type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
            <button class="remove" onclick="removeFromCart('${item.id}')">Remove from Cart</button>
        `;
        cartContainer.appendChild(cartItemDiv);
    });
 
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    document.getElementById('total').innerText = `$${total.toFixed(2)}`;
 
    const cartCount = document.getElementById('count');
    cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
}
 
async function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId); // Compare directly with productId
 
    if (itemIndex > -1) {
        await fetch(`${urlcart}/${productId}`, { // Use productId in the URL
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        cart.splice(itemIndex, 1);
        updateCart();
    } else {
        console.error('Item not found in cart');
    }
}
 
 
 
function updateQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = parseInt(newQuantity);
        const updatedCartItem = { ...cartItem, quantity: cartItem.quantity };
        fetch(`${urlcart}/${productId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCartItem)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to update quantity');
            }
            updateCart();
        }).catch(error => {
            console.error('Error updating quantity:', error);
        });
    }
}
 
// Initialize the display
displayProducts(products);


let itemscheckout = [];

async function checkout() {
    // Assuming cart is a global variable or retrieved from some context
    const checkoutItems = cart; 

    if (Array.isArray(checkoutItems) && checkoutItems.length > 0) {
        for (const item of checkoutItems) {
            const { id, title, image, quantity, price } = item;
            let newCheckoutItem = {
                id: id,
                title: title,
                image: image,
                quantity: quantity,
                price: price
            };

            itemscheckout.push(newCheckoutItem);

            try {
                const response = await fetch(urlcheckout, {
                    method: "POST",
                    body: JSON.stringify(newCheckoutItem),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

       
            } catch (error) {
                console.error('Network error:', error);
            }
        }
      
        window.location.href = "message.html";

    } else {
        console.error('Cart is empty or not an array.');
    }
}


//const messagecontainer = document.getElementById('root');

//function checkoutmessage() {
  //  console.log('Displaying checkout message');
    //messagecontainer.innerHTML=''
      //  messagecontainer.innerHTML = `
        //    <p>Thank you for shopping with us</p>
       // `;
    
//}
