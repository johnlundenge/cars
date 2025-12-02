// Sample car data for cart functionality
const carsData = [
    {
        id: 1,
        name: 'Tesla Model 3',
        price: 42990,
        image: 'download.jpg',
        details: '2023 • 15,000 mi • Electric • White'
    },
    {
        id: 2,
        name: 'BMW X5 xDrive40i',
        price: 68500,
        image: 'download (1).jpg',
        details: '2024 • 8,200 mi • Hybrid • Black'
    },
    {
        id: 3,
        name: 'Porsche 911 Turbo S',
        price: 215000,
        image: 'download (2).jpg',
        details: '2023 • 3,100 mi • Gasoline • Red'
    },
    {
        id: 4,
        name: 'Nissan Leaf SV',
        price: 29990,
        image: 'images (1).jpg',
        details: '2024 • 500 mi • Electric • Blue'
    },
    {
        id: 5,
        name: 'Audi Q7 Premium',
        price: 79900,
        image: 'jeep.jpg',
        details: '2023 • 12,000 mi • Gasoline • Gray'
    },
    {
        id: 6,
        name: 'Lamborghini Huracán',
        price: 289000,
        image: 'huma.jpg',
        details: '2022 • 1,800 mi • Gasoline • Yellow'
    }
];

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuToggle.textContent = navLinks.classList.contains('open') ? 'Close' : 'Menu';
});

// Render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCart');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.style.display = 'flex';
    } else {
        emptyCartMessage.style.display = 'none';
        cartItemsContainer.innerHTML = cart.map((item, index) => {
            const carData = carsData.find(car => car.id === item.id);
            return `
                <div class="cart-item">
                    <img src="${carData.image}" alt="${carData.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${carData.name}</h3>
                        <p>${carData.details}</p>
                        <p class="cart-item-price">$${carData.price.toLocaleString()}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-selector">
                            <button class="qty-decrease" data-index="${index}">−</button>
                            <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="qty-input">
                            <button class="qty-increase" data-index="${index}">+</button>
                        </div>
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        document.querySelectorAll('.qty-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(parseInt(e.target.dataset.index), -1));
        });
        document.querySelectorAll('.qty-increase').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(parseInt(e.target.dataset.index), 1));
        });
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                const newQty = Math.max(1, parseInt(e.target.value) || 1);
                cart[index].quantity = newQty;
                saveCart();
                renderCart();
                updateSummary();
            });
        });
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => removeFromCart(parseInt(e.target.dataset.index)));
        });
    }

    updateSummary();
}

// Update quantity
function updateQuantity(index, change) {
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    saveCart();
    renderCart();
    updateSummary();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// Update order summary
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => {
        const carData = carsData.find(car => car.id === item.id);
        return sum + (carData.price * item.quantity);
    }, 0);

    const tax = subtotal * 0.10;
    const shipping = subtotal > 0 ? (subtotal > 100000 ? 0 : 500) : 0;
    const total = subtotal + tax + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('tax').textContent = `$${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('total').textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout button
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        alert('Thank you for your order! Proceeding to payment...');
        // Clear cart after checkout
        cart = [];
        saveCart();
        renderCart();
    }
});

// Initial render
renderCart();
