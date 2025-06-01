document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const addressList = document.querySelector('.address-list');
    
    // 加载用户地址
    if(currentUser && currentUser.addresses) {
        currentUser.addresses.forEach(address => {
            const addressItem = document.createElement('div');
            addressItem.className = 'address-item';
            addressItem.innerHTML = `
                <h3>${address.name} ${address.phone}</h3>
                <p>${address.province} ${address.city} ${address.district} ${address.detail}</p>
                <div class="address-actions">
                    <button class="edit-btn">编辑</button>
                    <button class="delete-btn">删除</button>
                </div>
            `;
            addressList.appendChild(addressItem);
        });
    }
    
    // 添加地址按钮事件
    document.querySelector('.add-address-btn').addEventListener('click', function() {
        // 这里添加跳转到添加地址页面的逻辑
        console.log('添加新地址');
    });
});
