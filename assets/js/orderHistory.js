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
    // อัพเดท progress steps
    updateProgressSteps(2);
    
    // ซ่อนส่วนตะกร้าสินค้า
    document.querySelector('.cart-container').style.display = 'none';
    
    // แสดงส่วนประวัติการสั่งซื้อ
    const historySection = document.querySelector('.order-history-section');
    historySection.style.display = 'block';
    
    // แสดงข้อมูลประวัติการสั่งซื้อ
    displayOrderHistory();
}

function showCart() {
    // อัพเดท progress steps
    updateProgressSteps(0);
    
    // แสดงตะกร้าสินค้า
    document.querySelector('.cart-container').style.display = 'block';
    
    // ซ่อนส่วนประวัติการสั่งซื้อ
    document.querySelector('.order-history-section').style.display = 'none';
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

    let historyHTML = `<div class="order-list">`;
    
    orderHistory.reverse().forEach(order => {
        const orderDate = new Date(order.orderDate).toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        historyHTML += `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-info">
                        <h3>คำสั่งซื้อ #${order.orderId}</h3>
                        <span class="order-date">${orderDate}</span>
                    </div>
                    <div class="order-status ${order.paymentStatus}">
                        ${getPaymentStatusText(order.paymentStatus)}
                    </div>
                </div>
                <div class="order-details">
                    ${order.items.map(item => `
                        <div class="item-row">
                            <span class="item-name">${item.name}</span>
                            <span class="item-quantity">x${item.quantity}</span>
                            <span class="item-price">฿${item.total.toLocaleString()}</span>
                        </div>
                    `).join('')}
                    <div class="order-total">
                        <span>ยอดรวมทั้งสิ้น:</span>
                        <span>฿${order.totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </div>`;
    });

    historyHTML += '</div>';
    container.innerHTML = historyHTML;
}

function getPaymentStatusText(status) {
    const statusMap = {
        'pending': 'รอการชำระเงิน',
        'paid': 'ชำระเงินแล้ว',
        'cancelled': 'ยกเลิก'
    };
    return statusMap[status] || status;
} 