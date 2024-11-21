document.addEventListener('DOMContentLoaded', () => {
    // เพิ่มการจัดการคลิกที่ progress steps
    setupProgressStepsClickHandlers();
    
    // ตรวจสอบ URL parameters เพื่อดูว่าควรแสดงประวัติการสั่งซื้อหรือไม่
    if (window.location.hash === '#history') {
        showOrderHistory();
    }
});

function setupProgressStepsClickHandlers() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            if (index === 2) { // ประวัติการสั่งซื้อ
                showOrderHistory();
            } else if (index === 0) { // ตะกร้าสินค้า
                showCart();
            }
        });
    });
}

function showOrderHistory() {
    updateProgressSteps(2);
    displayOrderHistory();
    // เพิ่ม hash ใน URL
    window.location.hash = 'history';
}

function showCart() {
    updateProgressSteps(0);
    // แสดงตะกร้าสินค้า
    document.querySelector('.cart-content').style.display = 'block';
    document.getElementById('order-history-container').innerHTML = '';
    // ลบ hash ออกจาก URL
    window.location.hash = '';
}

function updateProgressSteps(activeIndex) {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index === activeIndex) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// ฟังก์ชันแสดงประวัติการสั่งซื้อ (คงเดิม)
function displayOrderHistory() {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const container = document.getElementById('order-history-container');
    
    // ซ่อนส่วนตะกร้าสินค้า
    document.querySelector('.cart-content').style.display = 'none';
    
    if (orderHistory.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-history fa-3x"></i>
                <p>ไม่พบประวัติการสั่งซื้อ</p>
                <a href="menu.html" class="btn-shop">
                    <i class="fas fa-shopping-cart"></i> เริ่มการสั่งซื้อ
                </a>
            </div>`;
        return;
    }

    // ... โค้ดส่วนที่เหลือคงเดิม ...
} 