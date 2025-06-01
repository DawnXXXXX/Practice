document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('.logout-btn');
    
    if(logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if(confirm('确定要退出登录吗？')) {
                // 清除sessionStorage中的用户信息
                sessionStorage.removeItem('currentUser');
                // 跳转到登录页面
                window.location.href = '../pages/login.html';
            }
        });
    }
});
