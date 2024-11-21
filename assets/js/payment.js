async function handlePayment() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
    if (cartItems.length === 0) {
        alert('กรุณาเพิ่มสินค้าในตะกร้าก่อนดำเนินการสั่งซื้อ');
        return;
    }

    // เช็คว่ามีข้อมูลจัดส่งแล้วหรือไม่
    const shippingData = localStorage.getItem('shippingData');
    if (!shippingData) {
        showDeliveryPopup();
        return;
    }

    // ถ้ามีข้อมูลจัดส่งแล้ว ดำเนินการชำระเงินต่อ
    initiatePayment(JSON.parse(shippingData));
}

async function initiatePayment(shippingData) {
    const button = document.querySelector('.checkout-btn');
    const frontend_url = "https://goomlpasd.github.io/food";
    
    try {
        // ดึงข้อมูลจาก localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // ดึงค่าส่งและส่วนลด
        const deliveryFee = parseFloat(document.getElementById('delivery').textContent);
        const discount = parseFloat(document.getElementById('discount').textContent);
        
        // ดึงราคารวมจากหน้าเว็บ
        const totalAmount = parseFloat(document.getElementById('total-price').textContent);
        
        // แปลงข้อมูลจากตะกร้า
        const items = cartItems.map(item => ({
            name: item.name,
            description: "อาหารจากร้าน YoCook",
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        }));

        // เพิ่มค่าส่งเป็นรายการแยก
        items.push({
            name: "ค่าจัดส่ง",
            description: "ค่าบริการจัดส่ง",
            price: deliveryFee,
            quantity: 1,
            total: deliveryFee
        });

        // ปิดปุ่มและแสดง loading
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังดำเนินการ...';

        // เรียก API สร้าง payment link
        const response = await fetch('https://tools.mbasic.io/create-payment-link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: items,
                totalAmount: totalAmount,
                domain: frontend_url,
                redirectUrl: `${frontend_url}/1.html`,
                metadata: {
                    deliveryFee: deliveryFee,
                    discount: discount,
                    customerEmail: shippingData.email,
                    shippingAddress: shippingData.address,
                    customerPhone: shippingData.phone,
                    customerName: shippingData.fullname,
                    note: shippingData.note
                }
            })
        });

        const data = await response.json();

        if (data.success && data.paymentUrl) {
            // บันทึกข้อมูลการสั่งซื้อ
            const orderData = {
                items: items,
                totalAmount: totalAmount,
                deliveryFee: deliveryFee,
                discount: discount,
                shippingData: shippingData,
                orderDate: new Date().toISOString(),
                orderId: data.orderId || Date.now()
            };
            
            // บันทึกประวัติการสั่งซื้อ
            const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
            orderHistory.push(orderData);
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

            // ลบข้อมูลในตะกร้าและข้อมูลจัดส่ง
            localStorage.removeItem('cartItems');
            localStorage.removeItem('shippingData');
            
            // redirect ไปยังหน้าชำระเงิน
            window.location.href = data.paymentUrl;
        } else {
            throw new Error(data.error || 'เกิดข้อผิดพลาดในการสร้างลิงก์ชำระเงิน');
        }

    } catch (error) {
        console.error('Payment error:', error);
        alert('เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง');
    } finally {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-shopping-bag"></i> ดำเนินการสั่งซื้อ';
    }
}

