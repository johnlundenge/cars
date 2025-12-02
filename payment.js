// Local copy of car data (used to render summary)
const carsData = [
    { id: 1, name: 'Tesla Model 3', price: 42990 },
    { id: 2, name: 'BMW X5 xDrive40i', price: 68500 },
    { id: 3, name: 'Porsche 911 Turbo S', price: 215000 },
    { id: 4, name: 'Nissan Leaf SV', price: 29990 },
    { id: 5, name: 'Audi Q7 Premium', price: 79900 },
    { id: 6, name: 'Lamborghini Huracán', price: 289000 }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderSummary() {
    const itemsList = document.getElementById('itemsList');
    if (!itemsList) return;

    if (cart.length === 0) {
        itemsList.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        itemsList.innerHTML = cart.map(item => {
            const car = carsData.find(c => c.id === item.id) || { name: 'Unknown', price: 0 };
            return `
                <div class="summary-item" style="display:flex;justify-content:space-between;margin-bottom:.5rem;">
                    <span>${car.name} × ${item.quantity}</span>
                    <strong>$${(car.price * item.quantity).toLocaleString()}</strong>
                </div>
            `;
        }).join('');
    }

    const subtotal = cart.reduce((sum, item) => {
        const car = carsData.find(c => c.id === item.id) || { price: 0 };
        return sum + car.price * item.quantity;
    }, 0);

    const tax = subtotal * 0.10;
    const shipping = subtotal > 0 ? (subtotal > 100000 ? 0 : 500) : 0;
    const total = subtotal + tax + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    document.getElementById('tax').textContent = `$${tax.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    document.getElementById('total').textContent = `$${total.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
}

// Simple validation helpers
function validCardNumber(num) {
    const cleaned = num.replace(/\s+/g, '');
    return /^4[0-9]{12}(?:[0-9]{3})?$/.test(cleaned) || /^5[1-5][0-9]{14}$/.test(cleaned);
}

document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty.');
        window.location.href = 'index.html#inventory';
        return;
    }

    const cardNumber = document.getElementById('cardNumber').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!fullName || !email) {
        alert('Please fill in billing name and email.');
        return;
    }

    if (!validCardNumber(cardNumber)) {
        // We only loosely validate card (accept common test cards)
        if (!confirm('Card number looks unusual. Continue with simulated payment?')) {
            return;
        }
    }

    // Simulate payment processing
    const payBtn = document.querySelector('#paymentForm button[type="submit"]');
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';

    setTimeout(() => {
        // Simulated success
        alert('Payment successful! Thank you for your purchase.');
        // Clear cart and redirect to thank you / home
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    }, 1200);
});

// Initial render
renderSummary();
