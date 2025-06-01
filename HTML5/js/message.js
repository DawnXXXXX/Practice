document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../pages/login.html';
        return;
    }
    
    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = '';
    
    // 添加客服卡片
    const customerServiceItem = document.createElement('div');
    customerServiceItem.className = 'message-item';
    customerServiceItem.innerHTML = `
        <div class="message-avatar">
            <img src="../images/customer-service.png" alt="客服头像">
        </div>
        <div class="message-content">
            <div class="message-user">
                <h3>平台客服</h3>
                <span class="time">在线</span>
            </div>
            <p class="message-preview">点击联系平台客服</p>
        </div>
    `;
    
    customerServiceItem.addEventListener('click', function() {
        window.location.href = 'chat.html?userId=customer-service';
    });
    
    messageList.appendChild(customerServiceItem);
    
    // 获取所有与该用户的聊天记录
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`message_${currentUser.account}_`) || 
            key.startsWith(`message_${currentUser.account}`)) {
            const message = JSON.parse(localStorage.getItem(key));
            const userId = key.split('_')[2];
            
            // 获取对方用户信息
            const seller = UserStorage.findUser(userId);
            
            // 创建消息卡片
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            messageItem.innerHTML = `
                <div class="message-avatar">
                    <img src="${seller?.avatar || '../images/default-avatar.png'}" alt="用户头像">
                </div>
                <div class="message-content">
                    <div class="message-user">
                        <h3>${seller?.username || userId}</h3>
                        <span class="time">${new Date(message.time).toLocaleTimeString()}</span>
                    </div>
                    <p class="message-preview">${message.content}</p>
                </div>
            `;
            
            messageItem.addEventListener('click', function() {
                window.location.href = `chat.html?userId=${userId}`;
            });
            
            messageList.appendChild(messageItem);
        }
    }
    
    // 确保已引入UserStorage
    if (typeof UserStorage === 'undefined') {
        console.error('UserStorage未定义');
        return;
    }

    // 添加空状态提示
    if (messageList.children.length === 0) {
        messageList.innerHTML = `
            <div class="empty-message">
                <p>暂无消息记录</p>
            </div>
        `;
    }
});
