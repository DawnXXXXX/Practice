document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../pages/login.html';
        return;
    }

    const form = document.getElementById('bind-phone-form');
    const smsBtn = form.querySelector('.sms-btn');
    
    // 获取验证码
    smsBtn.addEventListener('click', function() {
        const phone = form.querySelector('input[type="tel"]').value;
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            alert('请输入正确的手机号码');
            return;
        }
        
        // 模拟发送验证码
        alert(`验证码已发送至 ${phone}`);
    });

    // 绑定手机
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phone = this.querySelector('input[type="tel"]').value;
        const code = this.querySelector('input[type="text"]').value;
        
        if (!phone || !code) {
            alert('请填写完整信息');
            return;
        }

        // 更新用户手机信息
        currentUser.phone = phone;
        UserStorage.updateUser(currentUser.account, { phone });
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('手机绑定成功！');
        window.location.href = 'security.html';
    });
});
