// ตรวจสอบการยอมรับ cookies
function checkCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        document.getElementById('cookie-banner').style.display = 'block';
    }
}

// เมื่อผู้ใช้ยอมรับ cookies
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookie-banner').style.display = 'none';
    
    // เริ่มใช้งาน cookies ที่จำเป็น
    enableEssentialCookies();
}

// เมื่อผู้ใช้ปฏิเสธ cookies
function rejectCookies() {
    localStorage.setItem('cookieConsent', 'rejected');
    document.getElementById('cookie-banner').style.display = 'none';
    
    // ลบ cookies ที่ไม่จำเป็น
    disableNonEssentialCookies();
}

// ฟังก์ชันสำหรับ cookies ที่จำเป็น
function enableEssentialCookies() {
    // เก็บเฉพาะข้อมูลที่จำเป็น เช่น ตะกร้าสินค้า
    // ใช้ localStorage แทน cookies สำหรับข้อมูลที่จำเป็น
}

// ฟังก์ชันสำหรับลบ cookies ที่ไม่จำเป็น
function disableNonEssentialCookies() {
    // ลบ cookies ที่ไม่จำเป็นทั้งหมด
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
}

// เรียกใช้งานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', checkCookieConsent); 