// Thông báo giao diện người dùng
var uiMessages = {
    // Thông báo chung
    noSqlGenerated: '-- Chưa có SQL được tạo',
    validationError: '-- Lỗi validation: Vui lòng kiểm tra các điều kiện',
    validationJsonError: '// Lỗi validation: Vui lòng kiểm tra các điều kiện',
    errorPrefix: '-- Lỗi: ',
    sqlPlaceholder: '-- SQL sẽ hiển thị ở đây',
    jsonPlaceholder: '// JSON rules sẽ hiển thị ở đây',
    
    // Thông báo JOIN
    joinSuccess: 'Đã kết nối thành công',
    joinRemoved: 'Đã xóa kết nối',
    joinError: 'Lỗi khi tạo kết nối',
    noRelationshipFound: 'Không tìm thấy quan hệ tự động',
    
    // Hướng dẫn sử dụng
    dragDropHint: 'Kéo thả giữa các bảng để tạo kết nối',
    joinExplanation: {
        'INNER JOIN': 'Chỉ lấy dữ liệu có trong cả 2 bảng',
        'LEFT JOIN': 'Lấy tất cả dữ liệu từ bảng trái, kể cả khi không có dữ liệu tương ứng ở bảng phải',
        'RIGHT JOIN': 'Lấy tất cả dữ liệu từ bảng phải, kể cả khi không có dữ liệu tương ứng ở bảng trái',
        'FULL OUTER JOIN': 'Lấy tất cả dữ liệu từ cả 2 bảng'
    },
    
    // Gợi ý quan hệ
    relationshipTypes: {
        'one-to-many': 'Một-nhiều',
        'many-to-one': 'Nhiều-một', 
        'many-to-many': 'Nhiều-nhiều',
        'one-to-one': 'Một-một'
    },
    
    // Thông báo trạng thái
    loading: 'Đang tải...',
    processing: 'Đang xử lý...',
    completed: 'Hoàn thành',
    
    // Hướng dẫn cho người mới
    tutorials: {
        joinBasics: 'JOIN giúp bạn kết hợp dữ liệu từ nhiều bảng. Ví dụ: kết hợp thông tin người dùng với đơn hàng của họ.',
        dragDrop: 'Kéo một bảng và thả lên bảng khác để tạo kết nối tự động.',
        suggestions: 'Hệ thống sẽ gợi ý các kết nối phù hợp dựa trên cấu trúc dữ liệu.',
        manualJoin: 'Nếu không có gợi ý tự động, bạn có thể tạo kết nối thủ công bằng cách chọn trường phù hợp.',
        subQueryBasics: 'SubQuery giúp tạo điều kiện phức tạp bằng cách sử dụng kết quả từ truy vấn khác.',
        subQueryTypes: 'Có 5 loại SubQuery chính: IN, NOT IN, EXISTS, NOT EXISTS và Scalar SubQuery.',
        subQuerySuggestions: 'Hệ thống tự động gợi ý các SubQuery phổ biến dựa trên bảng hiện tại và mối quan hệ dữ liệu.'
    },
    
    // Giải thích SubQuery
    subQueryExplanation: {
        'where_in': 'Kiểm tra giá trị có trong danh sách kết quả của truy vấn con',
        'where_not_in': 'Kiểm tra giá trị không có trong danh sách kết quả của truy vấn con',
        'where_exists': 'Kiểm tra có tồn tại bản ghi thỏa mãn điều kiện trong truy vấn con',
        'where_not_exists': 'Kiểm tra không tồn tại bản ghi thỏa mãn điều kiện trong truy vấn con',
        'select_scalar': 'Lấy một giá trị duy nhất từ truy vấn con (COUNT, SUM, AVG, MAX, MIN)'
    }
};