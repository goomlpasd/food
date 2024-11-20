document.addEventListener('DOMContentLoaded', function() {
    const historyBtn = document.querySelector('.progress-step');
    if (historyBtn) {
        historyBtn.addEventListener('click', showPaymentHistory);
    }
}); 