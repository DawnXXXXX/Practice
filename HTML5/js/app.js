document.addEventListener('DOMContentLoaded', function () {
    // 只在引导页执行跳转
    if (document.querySelector('.splash-screen')) {
        setTimeout(function () {
            window.location.href = 'pages/home.html';
        }, 3000);
    }

    // 添加一些交互效果
    const logo = document.querySelector('.logo');
    logo.addEventListener('click', function () {
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 300);
    });
});