document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = '../pages/login.html';
        return;
    }

    // 更新用户信息显示
    document.querySelector('.avatar img').src = currentUser.avatar;
    document.querySelector('.user-detail h2').textContent = currentUser.username;
    document.querySelector('.user-detail p').textContent = `账号: ${currentUser.account}`;

});


function showAboutDialog() {
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '0';
    dialog.style.left = '0';
    dialog.style.width = '100%';
    dialog.style.height = '100%';
    dialog.style.backgroundColor = 'rgba(0,0,0,0.5)';
    dialog.style.display = 'flex';
    dialog.style.justifyContent = 'center';
    dialog.style.alignItems = 'center';
    dialog.style.zIndex = '1000';

    const content = document.createElement('div');
    content.style.backgroundColor = 'white';
    content.style.padding = '20px';
    content.style.borderRadius = '8px';
    content.style.width = '300px';
    content.innerHTML = `
        <h3>关于我们</h3>
        <p>欢迎使用闲置APP</p>
        <p>版本: 1.0.0</p>
        <button onclick="this.parentNode.parentNode.remove()" 
                style="margin-top:15px; padding:8px 16px; background:#ff5e62; color:white; border:none; border-radius:4px;">
            关闭
        </button>
    `;

    dialog.appendChild(content);
    document.body.appendChild(dialog);
}

// 确保函数在全局作用域可用
window.showAboutDialog = showAboutDialog;