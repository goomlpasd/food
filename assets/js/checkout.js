document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout.js loaded');
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleCheckout();
        });
    }
});
// --------------------------------------------
// function handleOrderComplete() {
//     alert('สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ');
//     localStorage.removeItem('cartItems');
//     window.location.href = 'index.html';
// }

// function handleCheckout() {
//     const modal = document.createElement('div');
//     modal.className = 'payment-modal';
//     modal.innerHTML = `
//         <div class="payment-form">
//             <h2>ข้อมูลบัตรเครดิต</h2>
//             <form id="payment-form" novalidate>
//                 <div class="form-group">
//                     <label>ชื่อผู้ถือบัตร</label>
//                     <input type="text" id="card-name" required>
//                 </div>
//                 <div class="form-group">
//                     <label>หมายเลขบัตร</label>
//                     <input type="text" 
//                            id="card-number" 
//                            maxlength="19" 
//                            pattern="[0-9]*"
//                            inputmode="numeric"
//                            placeholder="0000 0000 0000 0000"
//                            onkeypress="return event.charCode >= 48 && event.charCode <= 57"
//                            oninput="
//                                this.value = this.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
//                            "
//                            required>
//                 </div>
//                 <div class="form-row">
//                     <div class="form-group">
//                         <label>วันหมดอายุ</label>
//                         <div class="expiry-inputs">
//                             <select id="expiry-month" required>
//                                 ${Array.from({length: 12}, (_, i) => `<option value="${i+1}">${String(i+1).padStart(2, '0')}</option>`)}
//                             </select>
//                             <select id="expiry-year" required>
//                                 ${Array.from({length: 10}, (_, i) => `<option value="${2024 + i}">${2024 + i}</option>`)}
//                             </select>
//                         </div>
//                     </div>
//                     <div class="form-group">
//                         <label>CVV</label>
//                         <input type="text" id="cvv" maxlength="3" required>
//                     </div>
//                 </div>
//                 <div class="form-group">
//                     <label>อีเมล</label>
//                     <input type="email" id="email" required>
//                 </div>
//                 <div class="button-group">
//                     <button type="submit" class="submit-btn">ยืนยันการชำระเงิน</button>
//                     <button type="button" class="cancel-btn" onclick="closePaymentModal()">ยกเลิก</button>
//                 </div>
//             </form>
//         </div>
//     `;

//     document.body.appendChild(modal);

//     // แก้ไขการจัดการ submit form
//     document.getElementById('payment-form').addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         // ตรวจสอบข้อมูลก่อนส่ง
//         const cardName = document.getElementById('card-name').value.trim();
//         const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
//         const cvv = document.getElementById('cvv').value.trim();
//         const email = document.getElementById('email').value.trim();

//         // ตรวจสอบว่าข้อมูลครบถ้วนและถูกต้อง
//         if (!cardName) {
//             alert('กรุณากรอกชื่อผู้ถือบัตร');
//             return;
//         }
//         if (!cardNumber || cardNumber.length !== 16) {
//             alert('กรุณากรอกหมายเลขบัตรให้ครบ 16 หลัก');
//             return;
//         }
//         if (!cvv || cvv.length !== 3) {
//             alert('กรุณากรอก CVV ให้ครบ 3 หลัก');
//             return;
//         }
//         if (!email || !email.includes('@')) {
//             alert('กรุณากรอกอีเมลให้ถูกต้อง');
//             return;
//         }

//         // ถ้าข้อมูลครบถ้วน ดำเนินการต่อ
//         const paymentData = {
//             cardName: cardName,
//             cardNumber: cardNumber.replace(/(.{4})/g, '$1 ').trim(),
//             expiryMonth: document.getElementById('expiry-month').value,
//             expiryYear: document.getElementById('expiry-year').value,
//             email: email,
//             amount: calculateTotal()
//         };
        
//         savePaymentHistory(paymentData);
        
//         setTimeout(() => {
//             closePaymentModal();
//             handleOrderComplete();
//         }, 1500);
//     });
// }

// function closePaymentModal() {
//     const modal = document.querySelector('.payment-modal');
//     if (modal) {
//         modal.remove();
//     }
// }

// // เพิ่มฟังก์ชันสำหรับบันทึกประวัติการชำระเงิน
// function savePaymentHistory(paymentData) {
//     let history = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
//     const newPayment = {
//         ...paymentData,
//         date: new Date().toLocaleString('th-TH'),
//         orderId: 'ORDER' + Date.now()
//     };
//     history.push(newPayment);
//     localStorage.setItem('paymentHistory', JSON.stringify(history));
// }

 
// -------------------------------------------


// เพิ่มฟังก์ชันสำหรับแสดงประวัติการชำระเงิน
function showPaymentHistory() {
    const history = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
    
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-history">
            <h2>ประวัติการชำระเงิน</h2>
            <div class="history-list">
                ${history.length === 0 ? '<p>ไม่พบประวัติการชำระเงิน</p>' : 
                    history.map(payment => `
                        <div class="history-item">
                            <div class="order-info">
                                <p><strong>เลขที่คำสั่งซื้อ:</strong> ${payment.orderId}</p>
                                <p><strong>วันที่:</strong> ${payment.date}</p>
                            </div>
                            <div class="payment-info">
                                <p><strong>ชื่อผู้ถือบัตร:</strong> ${payment.cardName}</p>
                                <p><strong>เลขบัตร:</strong> **** **** **** ${payment.cardNumber.slice(-4)}</p>
                                <p><strong>อีเมล:</strong> ${payment.email}</p>
                                <p><strong>จำนวนเงิน:</strong> ${payment.amount.toLocaleString()} บาท</p>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
            <button class="cancel-btn" onclick="closePaymentModal()">ปิด</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}