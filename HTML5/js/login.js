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
            const account = this.querySelector('input[type="text"]').value;
            const password = this.querySelector('input[type="password"]').value;

            const user = UserStorage.findUser(account);

            if (user && user.password === password) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = '../pages/home.html';
            } else {
                alert('账号或密码错误！');
            }
        });
    }

    // 注册表单提交
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const account = this.querySelector('input[type="text"]').value;
            const password = this.querySelectorAll('input[type="password"]')[0].value;
            const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;

            // 账号验证：4位数字
            if (!/^\d{4}$/.test(account)) {
                alert('账号必须为4位数字！');
                return;
            }

            // 密码验证：至少6位
            if (password.length < 6) {
                alert('密码长度至少6位！');
                return;
            }

            if (password !== confirmPassword) {
                alert('两次输入的密码不一致！');
                return;
            }

            if (UserStorage.findUser(account)) {
                alert('账号已存在！');
                return;
            }

            const newUser = {
                account,
                username: `用户${Math.floor(Math.random() * 10000)}`, // 自动生成用户名
                password,
                avatar: '../images/default-avatar.png',
                products: [], // 发布的商品
                purchases: [], // 购买的商品
                favorites: [], // 收藏的商品
                soldProducts: [], //卖出的商品
                sellerInfo: {
                    rating: 5.0,
                    totalSales: 0,
                    description: ''
                },
                reviews: [], // 买家评价
                createdAt: new Date().toISOString()
            };

            UserStorage.addUser(newUser);
            alert('注册成功！请登录');

            // 切换到登录标签并填充账号
            document.querySelector('.auth-tab[data-tab="login"]').click();
            loginForm.querySelector('input[type="text"]').value = account;
            loginForm.querySelector('input[type="password"]').value = '';
        });
    }
});