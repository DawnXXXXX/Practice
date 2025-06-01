// 登录注册逻辑
document.addEventListener('DOMContentLoaded', function () {
    // 切换登录/注册标签
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // 移除所有active类
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // 添加active类到当前标签和对应表单
            this.classList.add('active');
            const formId = this.dataset.tab + '-form';
            document.getElementById(formId).classList.add('active');
        });
    });

    // 登录表单提交
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // 这里添加登录逻辑
            console.log('登录表单提交');
        });
    }

    // 注册表单提交
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // 这里添加注册逻辑
            console.log('注册表单提交');
        });
    }

    // 获取验证码按钮
    const smsBtn = document.querySelector('.sms-btn');
    if (smsBtn) {
        smsBtn.addEventListener('click', function () {
            // 这里添加获取验证码逻辑
            console.log('获取验证码');
        });
    }
});