function addToCart(item) {
    const cartItems = document.getElementById('cartItems');
    const listItem = document.createElement('li');
    listItem.textContent = item;
    cartItems.appendChild(listItem);
    alert(item + ' ถูกเพิ่มในตะกร้า!');
}
function addToCart(itemName, itemPrice) {
    // ดึงรายการตะกร้าที่มีอยู่ใน Local Storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // เพิ่มสินค้าใหม่ลงในตะกร้า
    cart.push({ name: itemName, price: itemPrice });

    // บันทึกข้อมูลตะกร้ากลับไปใน Local Storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // แสดงข้อความแจ้งเตือน
    alert(`เพิ่ม "${itemName}" สั่งอาหารเรียบร้อยแล้ว!`);

}
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("dot");
        
        // ซ่อนภาพทั้งหมด
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        // เพิ่ม slideIndex เพื่อแสดงภาพถัดไป
        slideIndex++;
        if (slideIndex > slides.length) { slideIndex = 1 } // กลับไปที่ภาพแรกเมื่อถึงภาพสุดท้าย

        // ล้างคลาส active จากจุดทั้งหมด
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

   

        // ตั้งเวลาให้ showSlides() ทำงานซ้ำทุกๆ 3 วินาที
        setTimeout(showSlides, 3000);
    }


