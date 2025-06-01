const BAIDU_MAP_AK = '21yKNbv3CQGR8e43xZgr0arU8eUhNRoi';

// 获取位置显示元素
const locationDisplay = document.getElementById('location-display');
const locationText = document.getElementById('location-text');

// 定位功能封装
function initLocation() {
    // 检查百度地图API是否加载
    if (typeof BMap === 'undefined') {
        loadBaiduMapAPI();
        return;
    }

    const geolocation = new BMap.Geolocation();

    geolocation.getCurrentPosition(
        function (r) {
            if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                handlePositionSuccess(r);
            } else {
                handlePositionError(this.getStatus());
            }
        },
        { enableHighAccuracy: true }
    );
}

// 加载百度地图API
function loadBaiduMapAPI() {
    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${BAIDU_MAP_AK}&callback=initLocation`;
    document.head.appendChild(script);
}

// 定位成功处理
function handlePositionSuccess(result) {
    const geocoder = new BMap.Geocoder();
    geocoder.getLocation(result.point, function (res) {
        if (res && res.addressComponents) {
            const address = res.addressComponents;
            // 优先显示街道，如果没有则显示区/县
            const minAddress = address.district || address.city;
            locationText.textContent = minAddress;

            // 获取当前用户并更新位置
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

            // 移除常见行政单位后缀
            const removeSuffix = (str) => str.replace(/(市|区|县|镇|乡|街道|村|社区|新区)$/, '');
            const city = removeSuffix(address.city);
            const district = removeSuffix(address.district);
            if (currentUser) {
                currentUser.location = city + district;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        } else {
            locationText.textContent = "获取详细地址失败";
        }
    });
}

// 定位错误处理
function handlePositionError(status) {
    switch (status) {
        case BMAP_STATUS_PERMISSION_DENIED:
            //未开启定位权限
            locationText.textContent = "定位失败";
            break;
        case BMAP_STATUS_TIMEOUT:
            locationText.textContent = "定位超时";
            break;
        case BMAP_STATUS_NOT_SUPPORTED:
            //浏览器不支持定位
            locationText.textContent = "定位失败";
            break;
        default:
            locationText.textContent = "定位失败";
            // 尝试IP定位作为备用
            new BMap.LocalCity().get(function (result) {
                locationText.textContent = result.name;
            });
    }
}
// 加载产品
function loadProducts() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';

    // 强制从localStorage重新加载数据
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }

    // 过滤掉已售出的商品
    const filteredProducts = products.filter(p => p.status !== '已售出');
    const sortedProducts = [...filteredProducts].sort((a, b) => b.id - a.id);

    sortedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="商品图片">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">¥${product.price}</p>
                <p class="products-location">${product.location}</p>
            </div>
        `;

        productCard.addEventListener('click', function () {
            window.location.href = `product-detail.html?id=${product.id}`;
        });

        productGrid.appendChild(productCard);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadProducts();

    // // 初始化定位
    // initLocation();

    // 点击重新定位
    if (locationDisplay) {
        locationDisplay.addEventListener('click', function () {
            locationText.textContent = "定位中...";
            initLocation();
        });
    }
    // 处理分类点击事件
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function () {
            const category = this.dataset.category;
            // 跳转到搜索页面并传递分类参数
            window.location.href = `search.html?category=${encodeURIComponent(category)}`;
        });
    });

    // 添加下拉刷新功能
    let startY, touchStartY;
    const mainContent = document.querySelector('.main-content');
    
    mainContent.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, {passive: true});

    mainContent.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const scrollTop = mainContent.scrollTop;
        
        // 下拉刷新判断
        if (scrollTop === 0 && touchY - touchStartY > 50) {
            e.preventDefault();
            refreshHomePage();
        }
    }, {passive: false});

    // 添加刷新按钮事件
    document.getElementById('refresh-btn').addEventListener('click', function() {
        refreshHomePage();
    });

    // 刷新首页函数
    function refreshHomePage() {
        // 显示加载状态
        const refreshBtn = document.getElementById('refresh-btn');
        refreshBtn.textContent = '⬜';
        refreshBtn.style.animation = 'spin 1s linear infinite';
        
        // 强制同步数据
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            localStorage.setItem('products', JSON.stringify(products)); // 强制写入
        }
        
        // 重新加载商品
        loadProducts();
        
        // 恢复按钮状态
        setTimeout(() => {
            refreshBtn.textContent = '⬜';
            refreshBtn.style.animation = '';
        }, 1000);
    }
    
    // 添加旋转动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
