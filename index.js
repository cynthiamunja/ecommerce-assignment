
let products = [];
 
 
const addProductButton = document.getElementById('btn');
const inputTitle = document.getElementById('product');
const inputImage = document.getElementById('image-url');
const inputPrice = document.getElementById('price');
const inputQuantity = document.getElementById('quantity');
const urlProduct = "http://localhost:3000/products";

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
            <h6>${product.title}</h6>
            <p> available:  ${product.quantity}</p>
            <p>Price: $${product.price}</p>
            <button class="addtocart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productDiv);
    });
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




//const messagecontainer = document.getElementById('root');

//function checkoutmessage() {
  //  console.log('Displaying checkout message');
    //messagecontainer.innerHTML=''
      //  messagecontainer.innerHTML = `
        //    <p>Thank you for shopping with us</p>
       // `;
    
//}
