function displayCartItems() {
    console.log('Displaying cart items');
    
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let cartTableBody = document.getElementById('cart-items');
    
    if (!cartTableBody) {
        console.log('Cart table body not found');
        return;
    }
    
    cartTableBody.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>&nbsp;ไม่มีรายการอาหารในตะกร้า
                </td>
            </tr>
        `;
        calculateTotal();
        return;
    }
    
    cartItems.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>฿${item.price}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </td>
            <td>฿${item.price * item.quantity}</td>
            <td>
                <button class="delete-btn" onclick="removeItem('${item.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });
    
    calculateTotal();
}

// เพิ่มสินค้าลงตะกร้า
function addToCart(name, price) {
    console.log('Adding to cart:', name, price);
    
    // ดึงข้อมูลตะกร้าปัจจุบัน
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // ตรวจสอบว่ามีสินค้านี้ในตะกร้าแล้วหรือไม่
    let existingItem = cartItems.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // บันทึกลงใน localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // แสดง notification
    showNotification(`เพิ่ม ${name} ลงในตะกร้าแล้ว!`);
    
    // อัพเดตการแสดงผลในตะกร้า
    displayCartItems();
    
    // อัพเดตจำนวนรายการในไอคอนตะกร้า
    updateCartIcon();
}

// แสดง notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// อัพเดตจำนวนในไอคอนตะกร้า
function updateCartIcon() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // หา badge ทั้งหมดที่มีในหน้า
    let badges = document.querySelectorAll('.cart-badge');
    
    badges.forEach(badge => {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    });
}

// อัพเดตจำนวน
function updateQuantity(name, change) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let item = cartItems.find(item => item.name === name);
    
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCartItems();
    }
}

// ลบรายการ
function removeItem(name) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.name !== name);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems();
}

// ฟังก์ชันคำนวณราคารวม
function calculateTotal() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let subtotal = 0;
    const deliveryFee = 30;
    let discount = 0; // ค่าส่วนลด

    // คำนวณราคารวมของสินค้า
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    // คำนวณราคารวมทั้งหมด (รวมค่าส่ง หักส่วนลด)
    const total = subtotal + deliveryFee - discount;

    // อัพเดตการแสดงผลในหน้าเว็บ
    
    document.getElementById('discount').textContent = discount;
    document.getElementById('total-price').textContent = total;
}

// เพิ่มฟังก์ชันล้างตะกร้า
function clearCart() {
    if(confirm('คุณต้องการล้างตะกร้าสินค้าทั้งหมดใช่หรือไม่?')) {
        localStorage.removeItem('cartItems');
        displayCartItems();
        calculateTotal();
    }
}

// เพิ่มฟังก์ชันดำเนินการสั่งซื้อ
function checkout() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if(cartItems.length === 0) {
        alert('กรุณาเพิ่มสินค้าในตะกร้าก่อนดำเนินการสั่งซื้อ');
        return;
    }
    
    // ทำการสั่งซื้อ (สามารถเพิ่มโค้ดสำหรับการชำระเงินได้ที่นี่)
    alert('ดำเนินการสั่งซื้อเรียบร้อย!');
    localStorage.removeItem('cartItems');
    displayCartItems();
    calculateTotal();
}

// เรียกใช้ฟังก์ชันเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded');
    displayCartItems();
    updateCartIcon();

});
