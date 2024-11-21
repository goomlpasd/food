function showDeliveryPopup() {
    document.getElementById('delivery-popup').style.display = 'block';
    // อัพเดต progress steps
    document.querySelectorAll('.progress-step')[1].classList.add('active');
}

function closeDeliveryPopup() {
    document.getElementById('delivery-popup').style.display = 'none';
    // ลบ active class จาก progress step
    document.querySelectorAll('.progress-step')[1].classList.remove('active');
}

function confirmDeliveryInfo() {
    const form = document.getElementById('shipping-form');
    
    // ตรวจสอบแต่ละฟิลด์ที่จำเป็นต้องกรอก
    const fullname = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    
    // ตรวจสอบว่าฟิลด์ที่จำเป็นไม่เป็นค่าว่าง
    if (!fullname || !phone || !email || !address) {
        alert('กรุณากร���กข้อมูลจัดส่งให้ครบถ้วน');
        return;
    }

    // ตรวจสอบรูปแบบเบอร์โทรศัพท์
    if (!/^[0-9]{10}$/.test(phone)) {
        alert('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)');
        return;
    }

    // ตรวจสอบรูปแบบอีเมล
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('กรุณากรอกอีเมลให้ถูกต้อง');
        return;
    }

    // เก็บข้อมูลจัดส่ง
    const shippingData = {
        fullname: fullname,
        phone: phone,
        email: email,
        address: address,
        note: document.getElementById('note').value.trim()
    };

    // บันทึกข้อมูลจัดส่งลง localStorage
    localStorage.setItem('shippingData', JSON.stringify(shippingData));
    
    // ปิด popup
    closeDeliveryPopup();
    
    // เรียกฟังก์ชันชำระเงินจาก payment.js
    initiatePayment(shippingData);
}

// เพิ่ม event listener สำหรับการกด Enter ในฟอร์ม
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shipping-form');
    const formInputs = form.querySelectorAll('input, textarea');
    
    // Event listener สำหรับการกด Enter
    formInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // ป้องกันการ submit form
                if (input.id === 'note') {
                    confirmDeliveryInfo();
                } else {
                    const nextInput = input.parentElement.nextElementSibling?.querySelector('input, textarea');
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
            }
        });

        // จัดการเมื่อมีการพิมพ์
        input.addEventListener('input', function() {
            const label = this.closest('.form-group').querySelector('label');
            const required = label.querySelector('.required');
            if (required) {
                required.style.display = this.value.trim() ? 'none' : 'inline';
            }
        });

        // จัดการเมื่อ focus ออก
        input.addEventListener('blur', function() {
            const label = this.closest('.form-group').querySelector('label');
            const required = label.querySelector('.required');
            if (required) {
                required.style.display = this.value.trim() ? 'none' : 'inline';
            }
        });
    });

    // Event listener สำหรับปุ่มปิด popup
    const closeBtn = document.querySelector('.close-popup');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDeliveryPopup);
    }

    // Event listener สำหรับการคลิกพื้นหลัง
    window.addEventListener('click', (e) => {
        const popup = document.getElementById('delivery-popup');
        if (e.target === popup) {
            closeDeliveryPopup();
        }
    });
});