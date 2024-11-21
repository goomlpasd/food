const CONFIG = {
    frontend_url: 'https://goomlpasd.github.io/food',
    api_url: 'https://tools.mbasic.io'
};

async function handlePayment() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        alert('กรุณาเพิ่มสินค้าในตะกร้าก่อนดำเนินการสั่งซื้อ');
        return;
    }

    const shippingData = localStorage.getItem('shippingData');
    if (!shippingData) {
        showDeliveryPopup();
        return;
    }

    await initiatePayment(JSON.parse(shippingData));
}

async function initiatePayment(shippingData) {
    const button = document.querySelector('.checkout-btn');
    
    try {
        // เตรียมข้อมูลการสั่งซื้อ
        const orderData = await prepareOrderData(shippingData);
        
        // แสดง loading state
        setLoadingState(button, true);

        // สร้าง payment link
        const paymentData = await createPaymentLink(orderData);

        if (paymentData.success && paymentData.paymentUrl) {
            // บันทึกข้อมูลการสั่งซื้อ
            await saveOrderData(orderData, paymentData.orderId);
            
            // redirect ไปยังหน้าชำระเงิน
            window.location.href = paymentData.paymentUrl;
        } else {
            throw new Error(paymentData.error || 'เกิดข้อผิดพลาดในการสร้างลิงก์ชำระเงิน');
        }

    } catch (error) {
        console.error('Payment error:', error);
        alert('เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง');
    } finally {
        setLoadingState(button, false);
    }
}

async function prepareOrderData(shippingData) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const deliveryFee = parseFloat(document.getElementById('delivery').textContent);
    const discount = parseFloat(document.getElementById('discount').textContent);
    const totalAmount = parseFloat(document.getElementById('total-price').textContent);

    const items = cartItems.map(item => ({
        name: item.name,
        description: "อาหารจากร้าน YoCook",
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
    }));

    items.push({
        name: "ค่าจัดส่ง",
        description: "ค่าบริการจัดส่ง",
        price: deliveryFee,
        quantity: 1,
        total: deliveryFee
    });

    return {
        items,
        totalAmount,
        deliveryFee,
        discount,
        shippingData,
        domain: CONFIG.frontend_url
    };
}

async function createPaymentLink(orderData) {
    const response = await fetch(`${CONFIG.api_url}/create-payment-link`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items: orderData.items,
            totalAmount: orderData.totalAmount,
            domain: orderData.domain,
            redirectUrl: `${CONFIG.frontend_url}/success.html`,
            metadata: {
                deliveryFee: orderData.deliveryFee,
                discount: orderData.discount,
                customerEmail: orderData.shippingData.email,
                shippingAddress: orderData.shippingData.address,
                customerPhone: orderData.shippingData.phone,
                customerName: orderData.shippingData.fullname,
                note: orderData.shippingData.note || ''
            }
        })
    });

    return await response.json();
}

async function saveOrderData(orderData, orderId) {
    try {
        // บันทึกประวัติการชำระเงิน
        const paymentResponse = await fetch(`${CONFIG.api_url}/payments?domain=${CONFIG.frontend_url}`);
        const paymentHistory = await paymentResponse.json();
        localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));

        // บันทึกข้อมูลการสั่งซื้อ
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        orderHistory.push({
            ...orderData,
            orderDate: new Date().toISOString(),
            orderId: orderId || `ORDER${Date.now()}`,
            paymentStatus: 'pending'
        });
        
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        
        // ล้างข้อมูลตะกร้าและข้อมูลจัดส่ง
        localStorage.removeItem('cartItems');
        localStorage.removeItem('shippingData');
    } catch (error) {
        console.error('Error saving order data:', error);
        throw error;
    }
}

function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังดำเนินการ...';
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-shopping-bag"></i> ดำเนินการสั่งซื้อ';
    }
}

