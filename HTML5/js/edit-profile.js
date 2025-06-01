document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const form = document.getElementById('edit-profile-form');
    const avatarInput = document.getElementById('avatar-input');
    const avatarPreview = document.getElementById('avatar-preview');
    const usernameInput = document.getElementById('username');

    // 初始化表单数据
    if(currentUser) {
        avatarPreview.src = currentUser.avatar || '../images/default-avatar.png';
        usernameInput.value = currentUser.username || '';
    }

    // 头像上传预览
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedUser = {
            ...currentUser,
            username: usernameInput.value.trim()
        };

        if(avatarInput.files[0]) {
            updatedUser.avatar = avatarPreview.src;
        }

        // 更新UserStorage和sessionStorage
        UserStorage.updateUser(currentUser.account, updatedUser);
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        alert('修改成功！');
        window.location.href = 'profile.html';
    });
});
