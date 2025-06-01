document.addEventListener('DOMContentLoaded', function () {
    // 获取URL中的商品ID参数
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 从products数据中查找对应商品
    // 修改商品详情获取逻辑
    const product = products.find(p => p.id == productId);
    if (product) {
        // 填充商品数据
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `¥${product.price.toFixed(2)}`;
        document.getElementById('product-location').textContent = product.location;
        document.getElementById('product-description').textContent = product.description || '暂无详细描述';

        // 检查是否是当前用户发布的商品
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser && currentUser.account == product.sellerAccount && product.status !== '已售出') {
            const actionsDiv = document.getElementById('product-actions');
            actionsDiv.style.display = 'block';

            // 编辑按钮点击事件
            document.getElementById('edit-btn').addEventListener('click', function () {
                window.location.href = `post.html?edit=${product.id}`;
            });

            // 删除按钮点击事件
            document.getElementById('delete-btn').addEventListener('click', function () {
                if (confirm('确定要删除这个商品吗？')) {
                    // 从商品列表中删除
                    const index = products.findIndex(p => p.id == product.id);
                    if (index !== -1) {
                        products.splice(index, 1);
                        localStorage.setItem('products', JSON.stringify(products));

                        // 从用户的商品列表中删除
                        const user = UserStorage.findUser(currentUser.account);
                        if (user && user.products) {
                            const productIndex = user.products.indexOf(product.id);
                            if (productIndex !== -1) {
                                user.products.splice(productIndex, 1);
                                UserStorage.updateUser(user.account, user);
                                sessionStorage.setItem('currentUser', JSON.stringify(user));
                            }
                        }

                        alert('商品已删除');
                        window.location.href = 'home.html';
                    }
                }
            });
        }
        // 加载卖家信息
        if (product.sellerAccount) {
            const seller = UserStorage.findUser(product.sellerAccount.toString());
            if (seller) {
                document.getElementById('seller-avatar').src = seller.avatar
                document.getElementById('seller-name').textContent = seller.username
                document.getElementById('seller-rating').textContent =
                    `${'⭐'.repeat(Math.floor(seller.sellerInfo?.rating))}${seller.sellerInfo?.rating}`;
            }
        }

        // 加载买家评价
        const reviewList = document.getElementById('review-list');
        if (product.sellerAccount) {
            const seller = UserStorage.findUser(product.sellerAccount.toString());
            if (seller && seller.reviews && seller.reviews.length > 0) {
                reviewList.innerHTML = '';
                seller.reviews.forEach(review => {
                    const buyer = UserStorage.findUser(review.account);
                    const reviewItem = document.createElement('div');
                    reviewItem.className = 'review-item';
                    reviewItem.innerHTML = `
                        <div class="review-avatar">
                            <img src="${buyer?.avatar || '../images/default-avatar.png'}" alt="买家头像">
                        </div>
                        <div class="review-content">
                            <div class="review-user">
                                ${buyer?.username || '匿名买家'}
                                <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                            </div>
                            <div class="review-text">${review.comment}</div>
                            <div class="review-time">${review.time}</div>
                        </div>
                    `;
                    reviewList.appendChild(reviewItem);
                });
            } else {
                reviewList.innerHTML = '<p style="color:#999;text-align:center;">暂无买家评价</p>';
            }
        }

        // 检查商品状态
        if (product.status === '已售出') {
            // 添加已售出标记
            const mainImage = document.getElementById('product-image');
            mainImage.insertAdjacentHTML('afterend', `
            <div class="sold-banner">已售出</div>
        `);

            // 禁用购买按钮
            const buyBtn = document.getElementById('buy-btn');
            buyBtn.disabled = true;
            buyBtn.style.opacity = '0.6';
        }

    }

    // 返回按钮事件
    document.getElementById('back-btn').addEventListener('click', function () {
        window.history.back();
    });


    // 收藏按钮事件
    const favoriteBtn = document.getElementById('favorite-btn');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // 初始化收藏状态
    if (currentUser && product) {
        const isFavorite = currentUser.favorites && currentUser.favorites.includes(product.id);
        favoriteBtn.textContent = isFavorite ? '★ 已收藏' : '☆ 收藏';
    }

    // 收藏按钮点击事件
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function () {
            if (!currentUser) {
                window.location.href = '../pages/login.html';
                return;
            }

            // 获取用户数据
            const user = UserStorage.findUser(currentUser.account);
            if (!user.favorites) {
                user.favorites = [];
            }

            const productIndex = user.favorites.indexOf(product.id);
            if (productIndex === -1) {
                // 添加收藏
                user.favorites.push(product.id);
                favoriteBtn.textContent = '★ 已收藏';
            } else {
                // 取消收藏
                user.favorites.splice(productIndex, 1);
                favoriteBtn.textContent = '☆ 收藏';
            }

            // 更新用户数据
            UserStorage.updateUser(user.account, { favorites: user.favorites });
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        });
    }


    // 购买按钮事件
    const buyBtn = document.getElementById('buy-btn');
    if (buyBtn) {
        buyBtn.addEventListener('click', function () {
            if (!currentUser) {
                window.location.href = '../pages/login.html';
                return;
            }

            // 检查商品是否已售出
            if (product.status === '已售出') {
                alert('该商品已售出');
                return;
            }

            // 确认购买
            if (!confirm(`确定要购买 ${product.name} 吗？`)) {
                return;
            }

            // 更新商品状态
            product.status = '已售出';

            // 更新商品数据
            const productIndex = products.findIndex(p => p.id === product.id);
            if (productIndex !== -1) {
                products[productIndex] = product;
                // 在购买成功后添加
                localStorage.setItem('products', JSON.stringify(products));
                if (typeof refreshProducts === 'function') {
                    refreshProducts();
                }
            }

            // 更新买家数据
            const user = UserStorage.findUser(currentUser.account);
            if (!user.purchases) {
                user.purchases = [];
            }
            user.purchases.push(product.id);

            // 更新卖家数据
            const seller = UserStorage.findUser(product.sellerAccount.toString());
            if (!seller.soldProducts) {
                seller.soldProducts = [];
            }
            seller.soldProducts.push(product.id);

            // 更新卖家销售数据
            if (seller.sellerInfo) {
                seller.sellerInfo.totalSales = (seller.sellerInfo.totalSales || 0) + 1;
            }

            // 保存用户数据
            UserStorage.updateUser(user.account, { purchases: user.purchases });
            UserStorage.updateUser(seller.account, {
                soldProducts: seller.soldProducts,
                sellerInfo: seller.sellerInfo
            });

            // 更新当前用户session
            sessionStorage.setItem('currentUser', JSON.stringify(user));

            alert('购买成功！');
            window.location.href = 'myTransaction.html?tab=bought';
        });
    }

    // 在文件底部添加
    function startChatWithSeller() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = '../pages/login.html';
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const product = products.find(p => p.id == productId);

        if (product && product.sellerAccount) {
            // 跳转到聊天页面
            window.location.href = `chat.html?userId=${product.sellerAccount}`;

            // 创建初始消息卡片
            const message = {
                sender: currentUser.account,
                receiver: product.sellerAccount,
                content: `你好，我对你的商品"${product.name}"感兴趣`,
                time: new Date().toISOString()
            };

            // 保存到消息列表
            const messageKey = `message_${currentUser.account}_${product.sellerAccount}`;
            localStorage.setItem(messageKey, JSON.stringify(message));
        }
    }
}); 