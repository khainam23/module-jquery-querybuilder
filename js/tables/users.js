// Cấu hình bảng Users
var usersTableConfig = {
    tableName: 'users',
    displayName: 'Người dùng',
    filters: [
        {
            id: 'id',
            label: 'ID',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal']
        },
        {
            id: 'username',
            label: 'Tên đăng nhập',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with', 'is_empty', 'is_not_empty']
        },
        {
            id: 'email',
            label: 'Email',
            type: 'string',
            operators: ['equal', 'not_equal', 'contains', 'is_empty', 'is_not_empty'],
            validation: {
                format: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            }
        },
        {
            id: 'full_name',
            label: 'Họ và tên',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with', 'is_empty', 'is_not_empty']
        },
        {
            id: 'age',
            label: 'Tuổi',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'gender',
            label: 'Giới tính',
            type: 'string',
            input: 'radio',
            values: {
                'male': 'Nam',
                'female': 'Nữ',
                'other': 'Khác'
            },
            operators: ['equal', 'not_equal']
        },
        {
            id: 'status',
            label: 'Trạng thái',
            type: 'string',
            input: 'select',
            values: {
                'active': 'Hoạt động',
                'inactive': 'Không hoạt động',
                'pending': 'Chờ xác nhận',
                'banned': 'Bị cấm'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'roles',
            label: 'Vai trò',
            type: 'string',
            input: 'checkbox',
            multiple: true,
            values: {
                'admin': 'Quản trị viên',
                'moderator': 'Điều hành viên',
                'user': 'Người dùng',
                'guest': 'Khách'
            },
            operators: ['in', 'not_in', 'contains']
        },
        {
            id: 'profile.address.city',
            label: 'Thành phố',
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
            id: 'profile.phone',
            label: 'Số điện thoại',
            type: 'string',
            operators: ['equal', 'not_equal', 'contains', 'begins_with'],
            validation: {
                format: /^(\+84|0)[0-9]{9,10}$/
            }
        },
        {
            id: 'created_at',
            label: 'Ngày tạo',
            type: 'datetime',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'last_login',
            label: 'Lần đăng nhập cuối',
            type: 'datetime',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between', 'is_null', 'is_not_null']
        },
        {
            id: 'is_verified',
            label: 'Đã xác thực',
            type: 'boolean',
            input: 'radio',
            values: {
                1: 'Đã xác thực',
                0: 'Chưa xác thực'
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
                id: 'age',
                operator: 'greater_or_equal',
                value: 18
            }
        ]
    }
};