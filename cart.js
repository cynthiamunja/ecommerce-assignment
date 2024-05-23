const addProductButton = document.getElementById('btn');
const inputTitle = document.getElementById('product');
const inputImage = document.getElementById('image-url');
const inputPrice = document.getElementById('price');
const inputQuantity = document.getElementById('quantity');
const urlProduct = "http://localhost:3000/products";
const urlcart = "http://localhost:3000/cart";
const urlcheckout="http://localhost:3000/checkout"
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
    if(!cartContainer){
        console.log("cart container not found")
    } else{ 
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