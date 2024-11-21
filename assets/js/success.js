document.addEventListener('DOMContentLoaded', () => {
    // ดึงข้อมูลประวัติการสั่งซื้อล่าสุด
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const latestOrder = orderHistory[orderHistory.length - 1];

    if (latestOrder) {
        // แสดงหมายเลขคำสั่งซื้อ
        const orderNumber = document.getElementById('orderNumber');
        if (orderNumber) {
            orderNumber.textContent = latestOrder.orderId;
        }

        // บันทึกเวลาที่สั่งซื้อ
        const orderTime = new Date(latestOrder.orderDate);
        localStorage.setItem('lastOrderTime', orderTime.toString());
    } else {
        // กรณีไม่พบข้อมูลการสั่งซื้อ ให้ redirect กลับไปหน้าหลัก
        window.location.href = 'index.html';
    }
});
