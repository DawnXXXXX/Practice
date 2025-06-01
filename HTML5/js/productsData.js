// 商品数据
let products = [];
const defaultProducts = [
    {
        id: 1,
        name: "苹果手机99新",
        price: 2000.00,  // 修改为保留两位小数
        image: "../images/product-1.jpg",
        location: "北京朝阳",
        category: "数码",
        description: "苹果手机99新，iPhone 13 Pro Max 99新，国行256G，无拆无修，电池健康98%，全套包装配件齐全",
        sellerAccount: 1000, // 卖家账号ID
        postTime: "2023-10-11T12:00:00Z" ,// 发布日期
        status: "在售" // 商品状态
    },
    {
        id: 2,
        name: "iPhone 12",
        price: 2800.00,  // 修改为保留两位小数
        image: "../images/product-2.jpg",
        location: "上海浦东",
        category: "数码",
        description: "苹果手机99新，iPhone 12 白色 128G，国行在保，轻微使用痕迹，功能一切正常",
        sellerAccount: 2000, // 卖家账号ID
        postTime: "2023-10-10T14:30:00Z" ,// 发布日期
        status: "在售" // 商品状态
    },
    {
        id: 3,
        name: "女士时尚大衣",
        price: 350.00,
        image: "../images/product-3.jpg",
        location: "广州天河",
        category: "服饰",
        description: "冬季女士时尚大衣，95新，只穿过几次，保暖性好",
        sellerAccount: 3000,
        postTime: "2023-10-09T10:15:00Z",
        status: "在售" // 商品状态
    },
    {
        id: 4,
        name: "名牌手提包",
        price: 800.00,
        image: "../images/product-4.jpg",
        location: "深圳南山",
        category: "服饰",
        description: "LV手提包，9成新，正品保证，附带购买小票",
        sellerAccount: 3000,
        postTime: "2023-10-08T16:30:00Z",
        status: "在售" // 商品状态
    },
];
// 初始化时从 localStorage 加载
const savedProducts = localStorage.getItem('products');

if (savedProducts) {
    products = JSON.parse(savedProducts);

    // 合并默认商品
    defaultProducts.forEach(defaultProduct => {
        if (!products.some(p => p.id === defaultProduct.id)) {
            products.push(defaultProduct);
        }
    });


} else {
    // 如果没有localStorage数据，使用默认商品数据并保存到products
    products = [...defaultProducts];
    localStorage.setItem('products', JSON.stringify(products));
}