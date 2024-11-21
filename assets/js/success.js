document.addEventListener('DOMContentLoaded', () => {
    // ดึงข้อมูลประวัติการสั่งซื้อล่าสุด
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const latestOrder = orderHistory[orderHistory.length - 1];

    if (!latestOrder) {
        // แสดง alert และ redirect กลับไปหน้าแรก
        alert('ไม่พบข้อมูลการสั่งซื้อ');
        window.location.href = 'index.html';
        return;
    }

    try {
        // แสดงหมายเลขคำสั่งซื้อ
        document.getElementById('orderNumber').textContent = latestOrder.orderId;

        // แสดงวันที่สั่งซื้อ
        const orderDate = new Date(latestOrder.orderDate);
        document.getElementById('orderDate').textContent = orderDate.toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // แสดงข้อมูลลูกค้า
        const shippingData = latestOrder.shippingData || {};
        document.getElementById('customerName').textContent = shippingData.fullname || 'ไม่ระบุ';
        document.getElementById('shippingAddress').textContent = shippingData.address || 'ไม่ระบุ';
        document.getElementById('phoneNumber').textContent = shippingData.phone || 'ไม่ระบุ';
        document.getElementById('email').textContent = shippingData.email || 'ไม่ระบุ';
        
        // แสดงยอดรวม
        document.getElementById('totalAmount').textContent = 
            (latestOrder.totalAmount || 0).toLocaleString();
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการแสดงข้อมูล กรุณาลองใหม่อีกครั้ง');
        alert('เกิดข้อผิดพลาดในการแสดงข้อมูล กรุณาลองใหม่อีกครั้ง');
        window.location.href = 'index.html';
    }
});
