// Core SubQuery - Dữ liệu và logic cơ bản
var SubQueryCore = {
    subQueries: [],
    availableTables: {},
    
    // Định nghĩa các loại sub query
    subQueryTypes: {
        'where_in': {
            name: 'Có trong danh sách',
            description: 'Kiểm tra giá trị có trong kết quả của truy vấn con',
            sqlTemplate: '{field} IN ({subquery})',
            icon: 'fas fa-list'
        },
        'where_not_in': {
            name: 'Không có trong danh sách',
            description: 'Kiểm tra giá trị không có trong kết quả của truy vấn con',
            sqlTemplate: '{field} NOT IN ({subquery})',
            icon: 'fas fa-list-slash'
        },
        'where_exists': {
            name: 'Tồn tại',
            description: 'Kiểm tra có tồn tại bản ghi thỏa mãn điều kiện',
            sqlTemplate: 'EXISTS ({subquery})',
            icon: 'fas fa-check-circle'
        },
        'where_not_exists': {
            name: 'Không tồn tại',
            description: 'Kiểm tra không tồn tại bản ghi thỏa mãn điều kiện',
            sqlTemplate: 'NOT EXISTS ({subquery})',
            icon: 'fas fa-times-circle'
        },
        'select_scalar': {
            name: 'Giá trị đơn',
            description: 'Lấy một giá trị từ truy vấn con (COUNT, MAX, MIN, AVG, SUM)',
            sqlTemplate: '({subquery}) as {alias}',
            icon: 'fas fa-calculator'
        }
    },

    // Khởi tạo core
    init: function() {
        if (typeof TableManager === 'undefined' || !TableManager.tables) {
            console.error('TableManager chưa sẵn sàng. SubQueryCore sẽ thử lại sau.');
            setTimeout(this.init.bind(this), 200);
            return;
        }
        this.availableTables = TableManager.tables;
    },

    // Thêm sub query
    addSubQuery: function(subQuery) {
        if (this.validateSubQuery(subQuery)) {
            subQuery.id = 'subquery_' + Date.now();
            this.subQueries.push(subQuery);
            return true;
        }
        return false;
    },

    // Xóa sub query
    removeSubQuery: function(subqueryId) {
        this.subQueries = this.subQueries.filter(sq => sq.id !== subqueryId);
    },

    // Xóa tất cả sub queries
    clearSubQueries: function() {
        this.subQueries = [];
    },

    // Lấy sub query theo ID
    getSubQuery: function(subqueryId) {
        return this.subQueries.find(sq => sq.id === subqueryId);
    },

    // Validate sub query
    validateSubQuery: function(subQuery) {
        if (subQuery.type.startsWith('where_') && !subQuery.type.includes('exists') && !subQuery.field) {
            alert('Vui lòng chọn trường để so sánh');
            return false;
        }
        
        if (!subQuery.targetTable) {
            alert('Vui lòng chọn bảng cho truy vấn con');
            return false;
        }
        
        if (!subQuery.targetField) {
            alert('Vui lòng chọn trường trả về từ truy vấn con');
            return false;
        }
        
        if (subQuery.type === 'select_scalar' && !subQuery.alias) {
            alert('Vui lòng nhập tên hiển thị cho truy vấn con');
            return false;
        }
        
        return true;
    },

    // Tạo mô tả cho sub query
    generateDescription: function(subQuery) {
        var typeConfig = this.subQueryTypes[subQuery.type];
        var targetConfig = this.availableTables[subQuery.targetTable];
        var description = '';
        
        switch(subQuery.type) {
            case 'where_in':
            case 'where_not_in':
                description = `Trường "${subQuery.field}" ${subQuery.type === 'where_in' ? 'có trong' : 'không có trong'} kết quả từ "${targetConfig.displayName}.${subQuery.targetField}"`;
                break;
            case 'where_exists':
            case 'where_not_exists':
                description = `${subQuery.type === 'where_exists' ? 'Tồn tại' : 'Không tồn tại'} bản ghi trong "${targetConfig.displayName}"`;
                break;
            case 'select_scalar':
                description = `Tính ${subQuery.aggregateFunction}(${subQuery.targetField}) từ "${targetConfig.displayName}"`;
                break;
        }
        
        return description;
    }
};