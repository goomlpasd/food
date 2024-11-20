 // Generate random order number
 function generateOrderNumber() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `YC${timestamp}${random}`;
}

// Set order number when page loads
document.getElementById('orderNumber').textContent = generateOrderNumber();

// Hamburger menu toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Clear cart after successful payment
localStorage.removeItem('cart');