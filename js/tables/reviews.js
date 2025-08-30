// Cấu hình bảng Reviews
var reviewsTableConfig = {
    tableName: 'reviews',
    displayName: 'Đánh giá',
    filters: [
        {
            id: 'id',
            label: 'ID Đánh giá',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal']
        },
        {
            id: 'product_id',
            label: 'ID Sản phẩm',
            type: 'integer',
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'user_id',
            label: 'ID Người dùng',
            type: 'integer',
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'reviewer_name',
            label: 'Tên người đánh giá',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with', 'is_empty', 'is_not_empty']
        },
        {
            id: 'reviewer_email',
            label: 'Email người đánh giá',
            type: 'string',
            operators: ['equal', 'not_equal', 'contains', 'is_empty', 'is_not_empty'],
            validation: {
                format: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            }
        },
        {
            id: 'rating',
            label: 'Số sao đánh giá',
            type: 'integer',
            input: 'select',
            values: {
                1: '1 sao',
                2: '2 sao',
                3: '3 sao',
                4: '4 sao',
                5: '5 sao'
            },
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'title',
            label: 'Tiêu đề đánh giá',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with', 'is_empty', 'is_not_empty']
        },
        {
            id: 'content',
            label: 'Nội dung đánh giá',
            type: 'string',
            operators: ['equal', 'not_equal', 'contains', 'is_empty', 'is_not_empty']
        },
        {
            id: 'status',
            label: 'Trạng thái',
            type: 'string',
            input: 'select',
            values: {
                'pending': 'Chờ duyệt',
                'approved': 'Đã duyệt',
                'rejected': 'Từ chối',
                'spam': 'Spam'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'is_verified_purchase',
            label: 'Mua hàng đã xác thực',
            type: 'boolean',
            input: 'radio',
            values: {
                1: 'Có',
                0: 'Không'
            },
            operators: ['equal']
        },
        {
            id: 'helpful_count',
            label: 'Số lượt hữu ích',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'unhelpful_count',
            label: 'Số lượt không hữu ích',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'sentiment.score',
            label: 'Điểm cảm xúc',
            type: 'double',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'sentiment.label',
            label: 'Nhãn cảm xúc',
            type: 'string',
            input: 'select',
            values: {
                'positive': 'Tích cực',
                'negative': 'Tiêu cực',
                'neutral': 'Trung tính'
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
                'quality': 'Chất lượng',
                'price': 'Giá cả',
                'shipping': 'Vận chuyển',
                'service': 'Dịch vụ',
                'design': 'Thiết kế',
                'durability': 'Độ bền'
            },
            operators: ['in', 'not_in', 'contains']
        },
        {
            id: 'images_count',
            label: 'Số lượng hình ảnh',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'created_at',
            label: 'Ngày tạo',
            type: 'datetime',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'updated_at',
            label: 'Ngày cập nhật',
            type: 'datetime',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'reply_count',
            label: 'Số lượng phản hồi',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        }
    ],
    defaultRules: {
        condition: 'AND',
        rules: [
            {
                id: 'status',
                operator: 'equal',
                value: 'approved'
            },
            {
                id: 'rating',
                operator: 'greater_or_equal',
                value: 3
            }
        ]
    }
};