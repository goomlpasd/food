function displayOrderHistory() {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const container = document.getElementById('order-history-container');
    
    if (orderHistory.length === 0) {
        container.innerHTML = '<div class="no-orders">ไม่พบประวัติการสั่งซื้อ</div>';
        return;
    }

    // เรียงลำดับจากใหม่ไปเก่า
    orderHistory.reverse().forEach(order => {
        const orderDate = new Date(order.orderDate).toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const orderElement = `
            <div class="order-card">
                <div class="order-header">
                    <h3>หมายเลขคำสั่งซื้อ: ${order.orderId}</h3>
                    <span class="order-date">วันที่สั่งซื้อ: ${orderDate}</span>
                </div>
                
                <div class="order-details">
                    <div class="shipping-info">
                        <h4>ข้อมูลการจัดส่ง</h4>
                        <p>ชื่อผู้รับ: ${order.shippingData.fullname}</p>
                        <p>ที่อยู่: ${order.shippingData.address}</p>
                        <p>เบอร์โทร: ${order.shippingData.phone}</p>
                        <p>อีเมล: ${order.shippingData.email}</p>
                        ${order.shippingData.note ? `<p>หมายเหตุ: ${order.shippingData.note}</p>` : ''}
                    </div>

                    <div class="order-items">
                        <h4>รายการอาหาร</h4>
                        <div class="items-list">
                            ${order.items
                                .filter(item => item.name !== "ค่าจัดส่ง")
                                .map(item => `
                                    <div class="item">
                                        <span>${item.name}</span>
                                        <span>${item.quantity} x ฿${item.price}</span>
                                        <span>฿${item.total}</span>
                                    </div>
                                `).join('')}
                        </div>
                    </div>

                    <div class="order-summary">
                        <div class="summary-item">
                            <span>ค่าจัดส่ง:</span>
                            <span>฿${order.deliveryFee}</span>
                        </div>
                        ${order.discount ? `
                            <div class="summary-item">
                                <span>ส่วนลด:</span>
                                <span>฿${order.discount}</span>
                            </div>
                        ` : ''}
                        <div class="summary-item total">
                            <span>ยอดรวมทั้งหมด:</span>
                            <span>฿${order.totalAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', orderElement);
    });
}

// เรียกใช้ฟังก์ชันเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', displayOrderHistory); 