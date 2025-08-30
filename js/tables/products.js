// Cấu hình bảng Products
var productsTableConfig = {
    tableName: 'products',
    displayName: 'Sản phẩm',
    filters: [
        {
            id: 'id',
            label: 'ID Sản phẩm',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal']
        },
        {
            id: 'name',
            label: 'Tên sản phẩm',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with', 'is_empty', 'is_not_empty']
        },
        {
            id: 'sku',
            label: 'Mã SKU',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with'],
            validation: {
                format: /^[A-Z0-9]{6,12}$/
            }
        },
        {
            id: 'category_id',
            label: 'Danh mục',
            type: 'integer',
            input: 'select',
            values: {
                1: 'Điện tử',
                2: 'Thời trang',
                3: 'Gia dụng',
                4: 'Sách',
                5: 'Thể thao',
                6: 'Làm đẹp'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'brand',
            label: 'Thương hiệu',
            type: 'string',
            input: 'select',
            values: {
                'apple': 'Apple',
                'samsung': 'Samsung',
                'nike': 'Nike',
                'adidas': 'Adidas',
                'sony': 'Sony',
                'lg': 'LG',
                'other': 'Khác'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'price',
            label: 'Giá (VNĐ)',
            type: 'double',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'discount_percent',
            label: 'Phần trăm giảm giá',
            type: 'double',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'stock_quantity',
            label: 'Số lượng tồn kho',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'status',
            label: 'Trạng thái',
            type: 'string',
            input: 'select',
            values: {
                'active': 'Đang bán',
                'inactive': 'Ngừng bán',
                'out_of_stock': 'Hết hàng',
                'discontinued': 'Ngừng sản xuất'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'tags',
            label: 'Thẻ tag',
            type: 'string',
            input: 'checkbox',
            multiple: true,
            values: {
                'bestseller': 'Bán chạy',
                'new': 'Mới',
                'sale': 'Giảm giá',
                'featured': 'Nổi bật',
                'limited': 'Giới hạn'
            },
            operators: ['in', 'not_in', 'contains']
        },
        {
            id: 'specifications.weight',
            label: 'Trọng lượng (kg)',
            type: 'double',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'specifications.dimensions.length',
            label: 'Chiều dài (cm)',
            type: 'double',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'specifications.color',
            label: 'Màu sắc',
            type: 'string',
            input: 'checkbox',
            multiple: true,
            values: {
                'red': 'Đỏ',
                'blue': 'Xanh dương',
                'green': 'Xanh lá',
                'black': 'Đen',
                'white': 'Trắng',
                'yellow': 'Vàng'
            },
            operators: ['in', 'not_in', 'contains']
        },
        {
            id: 'rating_average',
            label: 'Đánh giá trung bình',
            type: 'double',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'created_at',
            label: 'Ngày tạo',
            type: 'datetime',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'is_featured',
            label: 'Sản phẩm nổi bật',
            type: 'boolean',
            input: 'radio',
            values: {
                1: 'Có',
                0: 'Không'
            },
            operators: ['equal']
        }
    ],
    defaultRules: {
        condition: 'AND',
        rules: [
            {
                id: 'status',
                operator: 'equal',
                value: 'active'
            },
            {
                id: 'stock_quantity',
                operator: 'greater',
                value: 0
            }
        ]
    }
};