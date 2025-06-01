document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const resultsContainer = document.getElementById('transaction-results');
    const pageTitle = document.getElementById('page-title');
    
    if (!currentUser) {
        window.location.href = '../pages/login.html';
        return;
    }

    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab') || 'posted';
    
    // 设置标题
    const titleMap = {
        'posted': '我发布的',
        'bought': '我买到的',
        'sold': '我卖出的',
        'favorites': '我的收藏'
    };
    pageTitle.textContent = titleMap[tab] || '我的交易';

    // 加载对应类型的商品
    function loadProducts(type) {
        let filteredProducts = [];
        
        switch(type) {
            case 'posted':
                // 我发布的商品 - 只显示未售出的商品
                filteredProducts = products.filter(p => 
                    currentUser.products && 
                    currentUser.products.includes(p.id) &&
                    p.status !== '已售出'  // 新增状态检查
                );
                break;
            case 'bought':
                // 我买到的商品 - 从currentUser.purchases获取商品ID列表
                filteredProducts = products.filter(p => 
                    currentUser.purchases && currentUser.purchases.includes(p.id)
                );
                break;
            case 'sold':
                // 我卖出的商品 - 只显示已售出的商品
                filteredProducts = products.filter(p => 
                    currentUser.soldProducts && 
                    currentUser.soldProducts.includes(p.id) &&
                    p.status === '已售出'  // 新增状态检查
                );
                break;
            case 'favorites':
                // 我的收藏 - 从currentUser.favorites获取商品ID列表
                filteredProducts = products.filter(p => 
                    currentUser.favorites && currentUser.favorites.includes(p.id)
                );
                break;
        }

        renderProducts(filteredProducts);
    }

    // 渲染商品列表
    function renderProducts(productsToRender) {
        resultsContainer.innerHTML = '';
        
        if (productsToRender.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align:center;color:#999;grid-column:1/-1;">暂无商品</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div style="position:relative">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='../images/default-product.png'">
                    ${product.status === '已售出' ? '<div class="sold-banner">已售出</div>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">¥${product.price.toFixed(2)}</p>
                </div>
            `;
            productCard.addEventListener('click', function() {
                window.location.href = `product-detail.html?id=${product.id}`;
            });
            resultsContainer.appendChild(productCard);
        });
    }
    loadProducts(tab);
});
