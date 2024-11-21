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

    let historyHTML = `
        <div class="history-container">
            <h2 class="history-title"><i class="fas fa-history"></i> ประวัติการสั่งซื้อ</h2>
            <div class="order-history-list">
    `;
    
    orderHistory.reverse().forEach(order => {
        const orderDate = new Date(order.orderDate).toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        historyHTML += `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h3>คำสั่งซื้อ #${order.orderId}</h3>
                        <span class="order-date">${orderDate}</span>
                    </div>
                    <div class="order-status ${order.paymentStatus}">
                        ${getPaymentStatusText(order.paymentStatus)}
                    </div>
                </div>
                
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="item-row">
                            <span class="item-name">${item.name}</span>
                            <span class="item-quantity">x${item.quantity}</span>
                            <span class="item-price">฿${item.total.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="order-summary">
                    <div class="summary-row">
                        <span>ค่าจัดส่ง:</span>
                        <span>฿${order.deliveryFee.toLocaleString()}</span>
                    </div>
                    ${order.discount ? `
                        <div class="summary-row discount">
                            <span>ส่วนลด:</span>
                            <span>-฿${order.discount.toLocaleString()}</span>
                        </div>
                    ` : ''}
                    <div class="summary-row total">
                        <span>ยอดรวมทั้งสิ้น:</span>
                        <span>฿${order.totalAmount.toLocaleString()}</span>
                    </div>
                </div>

                <div class="shipping-details">
                    <h4>ข้อมูลการจัดส่ง</h4>
                    <p><strong>ชื่อผู้รับ:</strong> ${order.shippingData.fullname}</p>
                    <p><strong>ที่อยู่:</strong> ${order.shippingData.address}</p>
                    <p><strong>เบอร์โทร:</strong> ${order.shippingData.phone}</p>
                    <p><strong>อีเมล:</strong> ${order.shippingData.email}</p>
                    ${order.shippingData.note ? `<p><strong>หมายเหตุ:</strong> ${order.shippingData.note}</p>` : ''}
                </div>
            </div>
        `;
    });

    historyHTML += '</div></div>';
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