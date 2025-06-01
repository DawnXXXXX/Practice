document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../pages/login.html';
        return;
    }

    const form = document.getElementById('change-password-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = this.querySelector('input[type="password"]').value;
        const newPassword = this.querySelectorAll('input[type="password"]')[1].value;
        const confirmPassword = this.querySelectorAll('input[type="password"]')[2].value;

        // 验证当前密码
        if (currentPassword !== currentUser.password) {
            alert('当前密码不正确');
            return;
        }

        // 验证新密码
        if (newPassword.length < 6) {
            alert('新密码长度至少6位');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('两次输入的新密码不一致');
            return;
        }

        // 更新密码
        currentUser.password = newPassword;
        UserStorage.updateUser(currentUser.account, { password: newPassword });
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('密码修改成功！');
        window.location.href = 'security.html';
    });
});
