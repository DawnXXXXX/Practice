document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('post-form');
    const imageInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = '../pages/login.html';
        return;
    }

    // 图片预览
    imageInput.addEventListener('change', function (e) {
        imagePreview.innerHTML = '';
        const files = e.target.files;

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(files[i]);
        }
    });
    // 自动填充地址
    const locationInput = document.getElementById('product-location');
    if (currentUser && currentUser.location && locationInput) {
        locationInput.value = typeof currentUser.location === 'string'
            ? currentUser.location
            : '';
    }

    // 如果是编辑模式，填充现有数据
    const urlParams = new URLSearchParams(window.location.search);
    const editProductId = urlParams.get('edit');
    let productToEdit = null;  // 在这里定义
    
    if (editProductId) {
        productToEdit = products.find(p => p.id == editProductId);
        if (productToEdit) {
            document.getElementById('product-name').value = productToEdit.name;
            document.getElementById('product-price').value = productToEdit.price.toFixed(2);
            document.getElementById('product-category').value = productToEdit.category;
            document.getElementById('product-description').value = productToEdit.description;
            document.getElementById('product-location').value = productToEdit.location;
            
            // 显示现有图片
            const img = document.createElement('img');
            img.src = productToEdit.image;
            imagePreview.appendChild(img);
        }
    }

    // 表单提交
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('product-name').value;
        const priceInput = document.getElementById('product-price').value;
        const price = parseFloat(priceInput);

        // 价格验证
        if (isNaN(price) || price <= 0) {
            alert('请输入有效的价格(必须大于0)');
            return;
        }

        // 限制小数位数
        const decimalCount = (priceInput.split('.')[1] || []).length;
        if (decimalCount > 2) {
            alert('价格最多保留两位小数');
            return;
        }

        const category = document.getElementById('product-category').value;
        const description = document.getElementById('product-description').value;
        const location = document.getElementById('product-location').value;
        const imageFile = imageInput.files[0];

        // 如果是编辑模式且没有上传新图片，使用原图片
        let imageData = editProductId && productToEdit ? productToEdit.image : null;
        
        if (imageFile) {
            // 读取图片为Base64
            const reader = new FileReader();
            reader.onload = function (event) {
                imageData = event.target.result;
                saveProduct();
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveProduct();
        }

        function saveProduct() {
            if (editProductId) {
                // 编辑现有商品
                const index = products.findIndex(p => p.id == editProductId);
                if (index !== -1) {
                    products[index] = {
                        ...products[index],
                        name,
                        price: parseFloat(price.toFixed(2)),
                        image: imageData,
                        location,
                        category,
                        description
                    };
                    localStorage.setItem('products', JSON.stringify(products));
                    alert('商品修改成功！');
                    window.location.href = 'product-detail.html?id=' + editProductId;
                }
            } else {
                // 添加新商品
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                const newProduct = {
                    id: newId,
                    name: name,
                    price: parseFloat(price.toFixed(2)),
                    image: imageData,
                    location: location,
                    category: category,
                    description: description,
                    sellerAccount: currentUser.account,
                    postTime: new Date().toISOString(),
                    status: '在售',
                };

                products.push(newProduct);
                localStorage.setItem('products', JSON.stringify(products));

                if (!currentUser.products) {
                    currentUser.products = [];
                }
                currentUser.products.push(newId);

                if (typeof UserStorage !== 'undefined') {
                    UserStorage.updateUser(currentUser.account, currentUser);
                    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                    alert('发布成功！');
                    window.location.href = 'home.html';
                }
            }
        }
    });
});
