# jQuery QueryBuilder - Tạo Query Dễ Dàng

![jQuery QueryBuilder](https://img.shields.io/badge/jQuery-QueryBuilder-blue)
![Version](https://img.shields.io/badge/version-2.7.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![PHP](https://img.shields.io/badge/PHP-Parser-purple)

Một ứng dụng web mạnh mẽ giúp tạo các truy vấn SQL phức tạp một cách trực quan và dễ dàng thông qua giao diện kéo thả. Ứng dụng hỗ trợ tiếng Việt và được tối ưu hóa cho nhiều loại bảng dữ liệu khác nhau. Bao gồm cả PHP Query Parser để xử lý và validate các query được tạo.

## 🌟 Tính năng chính

### ✨ Giao diện trực quan
- **Drag & Drop**: Tạo truy vấn bằng cách kéo thả các điều kiện
- **Giao diện tiếng Việt**: Hoàn toàn được bản địa hóa
- **Responsive Design**: Tương thích với mọi thiết bị
- **Real-time Preview**: Xem kết quả SQL và JSON ngay lập tức

### 🗃️ Hỗ trợ đa bảng
- **👥 Người dùng (Users)**: Quản lý thông tin người dùng
- **📦 Sản phẩm (Products)**: Quản lý catalog sản phẩm
- **🛒 Đơn hàng (Orders)**: Theo dõi đơn hàng và giao dịch
- **📂 Danh mục (Categories)**: Phân loại sản phẩm
- **⭐ Đánh giá (Reviews)**: Quản lý feedback khách hàng

### 🔧 Tính năng nâng cao
- **Validation**: Kiểm tra tính hợp lệ của dữ liệu đầu vào
- **Multiple Operators**: Hỗ trợ đầy đủ các toán tử SQL
- **Nested Conditions**: Tạo điều kiện lồng nhau phức tạp
- **Real-time Generation**: Tự động tạo SQL và JSON khi thay đổi
- **PHP Query Parser**: Xử lý và validate query từ phía backend
- **Query Templates**: Lưu và tái sử dụng các query mẫu
- **Export Options**: Xuất ra SQL và JSON

## 🚀 Demo trực tuyến

Mở file `index.html` trong trình duyệt để trải nghiệm ngay lập tức.

## 📋 Yêu cầu hệ thống

- **Trình duyệt**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **JavaScript**: ES5+ support
- **Internet**: Cần kết nối để tải CDN resources

## 🛠️ Cài đặt

### Cách 1: Sử dụng trực tiếp
```bash
# Clone repository
git clone [repository-url]
cd jsonbuilder-jquery

# Mở file index.html trong trình duyệt
```

### Cách 2: Chạy với HTTP Server
```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng Node.js
npx http-server

# Truy cập http://localhost:8000
```

## 📁 Cấu trúc dự án

```
jsonbuilder-jquery/
├── index.html                  # File chính của ứng dụng
├── js/
│   ├── app.js                  # Logic chính của ứng dụng
│   ├── table-manager.js        # Quản lý chuyển đổi giữa các bảng
│   └── tables/                 # Cấu hình các bảng dữ liệu
│       ├── users.js            # Cấu hình bảng người dùng
│       ├── products.js         # Cấu hình bảng sản phẩm
│       ├── orders.js           # Cấu hình bảng đơn hàng
│       ├── categories.js       # Cấu hình bảng danh mục
│       └── reviews.js          # Cấu hình bảng đánh giá
├── query/
│   └── test1.json              # Query mẫu để test
├── test_query_parser.php       # PHP Query Parser và validator
└── README.md                   # Tài liệu hướng dẫn
```

## 🎯 Cách sử dụng

### Bước 1: Chọn bảng dữ liệu
1. Mở ứng dụng trong trình duyệt
2. Sử dụng dropdown "Chọn bảng dữ liệu" để chọn bảng muốn làm việc
3. Hệ thống sẽ tự động load các trường và điều kiện mặc định

### Bước 2: Tạo điều kiện truy vấn
1. **Thêm điều kiện**: Click nút "+" để thêm rule mới
2. **Chọn trường**: Chọn trường dữ liệu từ dropdown
3. **Chọn toán tử**: Chọn toán tử phù hợp (=, !=, >, <, LIKE, etc.)
4. **Nhập giá trị**: Nhập giá trị cần so sánh
5. **Nhóm điều kiện**: Sử dụng AND/OR để kết hợp các điều kiện

### Bước 3: Xem kết quả
- **SQL Query**: Xem truy vấn SQL được tạo tự động
- **JSON Rules**: Xem cấu trúc JSON của các điều kiện
- **Real-time**: Kết quả được cập nhật ngay khi thay đổi

### Bước 4: Sử dụng kết quả
- **Copy SQL query**: Sử dụng trực tiếp trong database
- **Copy JSON rules**: Lưu trữ hoặc tái sử dụng query
- **PHP Processing**: Sử dụng `test_query_parser.php` để xử lý query từ backend
- **Reset**: Sử dụng nút "Reset" để bắt đầu lại

### Bước 5: Xử lý với PHP (Backend)
```php
// Sử dụng PHP Query Parser
$parser = new QueryBuilderParser();
$jsonQuery = file_get_contents('query/test1.json');
$sql = $parser->parseQuery($jsonQuery, 'users');
echo $sql; // SELECT * FROM `users` WHERE ...
```

## 📊 Các loại dữ liệu được hỗ trợ

### Kiểu dữ liệu cơ bản
- **String**: Văn bản, hỗ trợ tìm kiếm mờ
- **Integer**: Số nguyên
- **Double**: Số thực
- **Boolean**: True/False
- **DateTime**: Ngày giờ với đầy đủ operators

### Kiểu input đặc biệt
- **Select**: Dropdown với các giá trị định sẵn
- **Radio**: Lựa chọn đơn
- **Checkbox**: Lựa chọn đa giá trị
- **Text**: Input tự do với validation

### Validation
- **Email**: Kiểm tra định dạng email
- **Phone**: Kiểm tra số điện thoại Việt Nam
- **SKU**: Kiểm tra mã sản phẩm
- **Custom Regex**: Validation tùy chỉnh

## 🔧 Tùy chỉnh

### Thêm bảng mới
1. Tạo file cấu hình trong `js/tables/`
2. Định nghĩa cấu trúc theo mẫu:

```javascript
var newTableConfig = {
    tableName: 'table_name',
    displayName: 'Tên hiển thị',
    filters: [
        {
            id: 'field_name',
            label: 'Nhãn hiển thị',
            type: 'string|integer|double|boolean|datetime',
            operators: ['equal', 'not_equal', ...],
            // Các tùy chọn khác...
        }
    ],
    defaultRules: {
        condition: 'AND',
        rules: [
            // Điều kiện mặc định...
        ]
    }
};
```

3. Thêm vào `table-manager.js`:
```javascript
tables: {
    // Các bảng hiện có...
    'new_table': newTableConfig
}
```

4. Cập nhật dropdown selector trong `createTableSelector()`

### Tùy chỉnh PHP Parser
```php
// Mở rộng QueryBuilderParser class
class CustomQueryBuilderParser extends QueryBuilderParser {
    // Thêm operators tùy chỉnh
    protected $customOperators = [
        'custom_op' => 'CUSTOM_SQL_OP'
    ];
    
    // Override parseRule để xử lý logic đặc biệt
    protected function parseRule($rule) {
        // Custom logic here
        return parent::parseRule($rule);
    }
}
```

### Tùy chỉnh operators
Có thể sử dụng các operators sau:
- `equal`, `not_equal`
- `less`, `less_or_equal`, `greater`, `greater_or_equal`
- `between`, `not_between`
- `begins_with`, `contains`, `ends_with`
- `is_empty`, `is_not_empty`
- `is_null`, `is_not_null`
- `in`, `not_in`

### Tùy chỉnh giao diện
- Sửa đổi CSS classes trong `index.html`
- Tùy chỉnh Tailwind CSS configuration
- Thay đổi Bootstrap components

## 🎨 Ví dụ sử dụng

### Ví dụ 1: Tìm người dùng hoạt động
**JSON Query:**
```json
{
  "condition": "AND",
  "rules": [
    {"id": "status", "operator": "equal", "value": "active"},
    {"id": "age", "operator": "greater_or_equal", "value": 18}
  ]
}
```

**SQL Output:**
```sql
SELECT * FROM `users` 
WHERE `status` = 'active' 
  AND `age` >= 18
```

### Ví dụ 2: Tìm sản phẩm giảm giá
**JSON Query:**
```json
{
  "condition": "AND",
  "rules": [
    {"id": "status", "operator": "equal", "value": "active"},
    {"id": "stock_quantity", "operator": "greater", "value": 0},
    {"id": "discount_percent", "operator": "greater", "value": 10}
  ]
}
```

**SQL Output:**
```sql
SELECT * FROM `products` 
WHERE `status` = 'active' 
  AND `stock_quantity` > 0 
  AND `discount_percent` > 10
```

### Ví dụ 3: Query phức tạp với nested conditions
**JSON Query:**
```json
{
  "condition": "AND",
  "rules": [
    {"id": "status", "operator": "equal", "value": "active"},
    {
      "condition": "OR",
      "rules": [
        {"id": "username", "operator": "contains", "value": "admin"},
        {"id": "email", "operator": "ends_with", "value": "@company.com"}
      ]
    }
  ]
}
```

**SQL Output:**
```sql
SELECT * FROM `users` 
WHERE `status` = 'active' 
  AND (`username` LIKE '%admin%' 
    OR `email` LIKE '%@company.com')
```