document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    
    // 从URL获取聊天对象ID
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    // 加载聊天记录
    function loadChatHistory() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = '../pages/login.html';
            return;
        }
        
        // 从localStorage获取聊天记录
        const chatKey = `chat_${currentUser.account}_${userId}`;
        let chatHistory = JSON.parse(localStorage.getItem(chatKey)) || [];
        
        // 检查是否有初始消息（从商品详情页发送的）
        const messageKey = `message_${currentUser.account}_${userId}`;
        const initialMessage = JSON.parse(localStorage.getItem(messageKey));
        
        // 如果存在初始消息且聊天记录为空，则添加初始消息
        if (initialMessage && chatHistory.length === 0) {
            chatHistory.push(initialMessage);
            localStorage.setItem(chatKey, JSON.stringify(chatHistory));
        }
        
        chatContainer.innerHTML = '';
        chatHistory.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender === currentUser.account ? 'sent' : 'received'}`;
            
            // 格式化时间
            const msgTime = new Date(msg.time);
            const formattedTime = `${msgTime.getFullYear()}-${(msgTime.getMonth()+1).toString().padStart(2, '0')}-${msgTime.getDate().toString().padStart(2, '0')} ${msgTime.getHours().toString().padStart(2, '0')}:${msgTime.getMinutes().toString().padStart(2, '0')}`;
            
            messageDiv.innerHTML = `
                <div class="message-content">${msg.content}</div>
                <div class="message-time">${formattedTime}</div>
            `;
            chatContainer.appendChild(messageDiv);
        });
        
        // 滚动到底部
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // 发送消息
    function sendMessage() {
        const content = messageInput.value.trim();
        if (!content) return;
        
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const now = new Date();
        const timeStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const newMessage = {
            sender: currentUser.account,
            receiver: userId,
            content: content,
            time: timeStr
        };
        
        // 保存消息
        const chatKey = `chat_${currentUser.account}_${userId}`;
        const chatHistory = JSON.parse(localStorage.getItem(chatKey)) || [];
        chatHistory.push(newMessage);
        localStorage.setItem(chatKey, JSON.stringify(chatHistory));
        
        // 清空输入框并重新加载
        messageInput.value = '';
        loadChatHistory();
    }
    
    // 事件监听
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    // 初始加载
    loadChatHistory();
});
