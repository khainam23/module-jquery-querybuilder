// Cấu hình bảng Orders
var ordersTableConfig = {
    tableName: 'orders',
    displayName: 'Đơn hàng',
    filters: [
        {
            id: 'id',
            label: 'ID Đơn hàng',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal']
        },
        {
            id: 'order_number',
            label: 'Mã đơn hàng',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with'],
            validation: {
                format: /^ORD[0-9]{8}$/
            }
        },
        {
            id: 'user_id',
            label: 'ID Khách hàng',
            type: 'integer',
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'customer_name',
            label: 'Tên khách hàng',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with', 'is_empty', 'is_not_empty']
        },
        {
            id: 'customer_email',
            label: 'Email khách hàng',
            type: 'string',
            operators: ['equal', 'not_equal', 'contains', 'is_empty', 'is_not_empty'],
            validation: {
                format: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            }
        },
        {
            id: 'status',
            label: 'Trạng thái đơn hàng',
            type: 'string',
            input: 'select',
            values: {
                'pending': 'Chờ xử lý',
                'confirmed': 'Đã xác nhận',
                'processing': 'Đang xử lý',
                'shipped': 'Đã gửi hàng',
                'delivered': 'Đã giao hàng',
                'cancelled': 'Đã hủy',
                'refunded': 'Đã hoàn tiền'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'payment_status',
            label: 'Trạng thái thanh toán',
            type: 'string',
            input: 'select',
            values: {
                'pending': 'Chờ thanh toán',
                'paid': 'Đã thanh toán',
                'failed': 'Thanh toán thất bại',
                'refunded': 'Đã hoàn tiền',
                'partial_refund': 'Hoàn tiền một phần'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'payment_method',
            label: 'Phương thức thanh toán',
            type: 'string',
            input: 'select',
            values: {
                'cash': 'Tiền mặt',
                'credit_card': 'Thẻ tín dụng',
                'debit_card': 'Thẻ ghi nợ',
                'bank_transfer': 'Chuyển khoản',
                'e_wallet': 'Ví điện tử',
                'cod': 'Thu hộ (COD)'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'total_amount',
            label: 'Tổng tiền (VNĐ)',
            type: 'double',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'discount_amount',
            label: 'Số tiền giảm giá (VNĐ)',
            type: 'double',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'shipping_fee',
            label: 'Phí vận chuyển (VNĐ)',
            type: 'double',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'shipping_address.city',
            label: 'Thành phố giao hàng',
            type: 'string',
            input: 'select',
            values: {
                'hanoi': 'Hà Nội',
                'hcm': 'TP. Hồ Chí Minh',
                'danang': 'Đà Nẵng',
                'haiphong': 'Hải Phòng',
                'cantho': 'Cần Thơ'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'shipping_address.district',
            label: 'Quận/Huyện giao hàng',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with']
        },
        {
            id: 'coupon_code',
            label: 'Mã giảm giá',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with', 'is_empty', 'is_not_empty']
        },
        {
            id: 'order_items_count',
            label: 'Số lượng sản phẩm',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'created_at',
            label: 'Ngày đặt hàng',
            type: 'datetime',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'shipped_at',
            label: 'Ngày gửi hàng',
            type: 'datetime',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between', 'is_null', 'is_not_null']
        },
        {
            id: 'delivered_at',
            label: 'Ngày giao hàng',
            type: 'datetime',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between', 'is_null', 'is_not_null']
        },
        {
            id: 'is_gift',
            label: 'Đơn hàng quà tặng',
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
                operator: 'not_equal',
                value: 'cancelled'
            },
            {
                id: 'created_at',
                operator: 'greater',
                value: '2024-01-01'
            }
        ]
    }
};