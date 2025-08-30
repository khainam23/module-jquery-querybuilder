// Cấu hình bảng Categories
var categoriesTableConfig = {
    tableName: 'categories',
    displayName: 'Danh mục',
    filters: [
        {
            id: 'id',
            label: 'ID Danh mục',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal']
        },
        {
            id: 'name',
            label: 'Tên danh mục',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with', 'is_empty', 'is_not_empty']
        },
        {
            id: 'slug',
            label: 'Slug URL',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with'],
            validation: {
                format: /^[a-z0-9-]+$/
            }
        },
        {
            id: 'parent_id',
            label: 'Danh mục cha',
            type: 'integer',
            input: 'select',
            values: {
                0: 'Danh mục gốc',
                1: 'Điện tử',
                2: 'Thời trang',
                3: 'Gia dụng',
                4: 'Sách',
                5: 'Thể thao',
                6: 'Làm đẹp'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
        },
        {
            id: 'level',
            label: 'Cấp độ',
            type: 'integer',
            input: 'select',
            values: {
                1: 'Cấp 1 (Gốc)',
                2: 'Cấp 2',
                3: 'Cấp 3',
                4: 'Cấp 4'
            },
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal']
        },
        {
            id: 'status',
            label: 'Trạng thái',
            type: 'string',
            input: 'select',
            values: {
                'active': 'Hoạt động',
                'inactive': 'Không hoạt động',
                'hidden': 'Ẩn'
            },
            operators: ['equal', 'not_equal', 'in', 'not_in']
        },
        {
            id: 'sort_order',
            label: 'Thứ tự sắp xếp',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'products_count',
            label: 'Số lượng sản phẩm',
            type: 'integer',
            operators: ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between']
        },
        {
            id: 'meta.seo_title',
            label: 'SEO Title',
            type: 'string',
            operators: ['equal', 'not_equal', 'begins_with', 'contains', 'ends_with', 'is_empty', 'is_not_empty']
        },
        {
            id: 'meta.seo_description',
            label: 'SEO Description',
            type: 'string',
            operators: ['equal', 'not_equal', 'contains', 'is_empty', 'is_not_empty']
        },
        {
            id: 'settings.show_in_menu',
            label: 'Hiển thị trong menu',
            type: 'boolean',
            input: 'radio',
            values: {
                1: 'Có',
                0: 'Không'
            },
            operators: ['equal']
        },
        {
            id: 'settings.allow_products',
            label: 'Cho phép sản phẩm',
            type: 'boolean',
            input: 'radio',
            values: {
                1: 'Có',
                0: 'Không'
            },
            operators: ['equal']
        },
        {
            id: 'settings.featured',
            label: 'Danh mục nổi bật',
            type: 'boolean',
            input: 'radio',
            values: {
                1: 'Có',
                0: 'Không'
            },
            operators: ['equal']
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
                id: 'level',
                operator: 'less_or_equal',
                value: 3
            }
        ]
    }
};