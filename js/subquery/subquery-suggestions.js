// SubQuery Suggestions - Gợi ý truy vấn con
var SubQuerySuggestions = {
    
    // Cập nhật gợi ý
    update: function() {
        // Kiểm tra xem TableManager có sẵn sàng không
        if (typeof TableManager === 'undefined' || !TableManager.getCurrentTableName) {
            $('#subquery-suggestions-list').html('<div class="text-sm text-gray-500 italic">Đang tải gợi ý...</div>');
            return;
        }
        
        var currentTable = TableManager.getCurrentTableName();
        var suggestions = this.generateSuggestions(currentTable);
        var suggestionsHtml = '';
        
        suggestions.forEach(function(suggestion) {
            suggestionsHtml += `
                <div class="subquery-suggestion bg-yellow-50 border border-yellow-200 rounded-lg p-3 cursor-pointer hover:bg-yellow-100 transition-colors" data-suggestion='${JSON.stringify(suggestion)}'>
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="font-medium text-gray-900">${suggestion.title}</div>
                            <div class="text-sm text-gray-600 mt-1">${suggestion.description}</div>
                            <div class="text-xs text-gray-500 mt-1">
                                <span class="bg-gray-100 px-2 py-1 rounded">${suggestion.example}</span>
                            </div>
                        </div>
                        <button class="add-suggested-subquery bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600">
                            <i class="fas fa-plus mr-1"></i>Thêm
                        </button>
                    </div>
                </div>
            `;
        });
        
        if (suggestionsHtml === '') {
            suggestionsHtml = '<div class="text-sm text-gray-500 italic">Không có gợi ý nào cho bảng hiện tại.</div>';
        }
        
        $('#subquery-suggestions-list').html(suggestionsHtml);
    },

    // Tạo gợi ý dựa trên bảng hiện tại
    generateSuggestions: function(currentTable) {
        var suggestions = [];
        
        switch(currentTable) {
            case 'users':
                suggestions = [
                    {
                        title: 'Người dùng có đơn hàng',
                        description: 'Tìm người dùng đã từng đặt hàng',
                        example: 'user_id IN (SELECT user_id FROM orders)',
                        type: 'where_in',
                        targetTable: 'orders',
                        field: 'id',
                        subqueryField: 'user_id'
                    },
                    {
                        title: 'Số lượng đơn hàng',
                        description: 'Đếm số đơn hàng của mỗi người dùng',
                        example: '(SELECT COUNT(*) FROM orders WHERE user_id = users.id)',
                        type: 'select_scalar',
                        targetTable: 'orders',
                        aggregateFunction: 'COUNT',
                        alias: 'order_count'
                    }
                ];
                break;
                
            case 'products':
                suggestions = [
                    {
                        title: 'Sản phẩm có đánh giá',
                        description: 'Tìm sản phẩm đã được đánh giá',
                        example: 'product_id IN (SELECT product_id FROM reviews)',
                        type: 'where_in',
                        targetTable: 'reviews',
                        field: 'id',
                        subqueryField: 'product_id'
                    },
                    {
                        title: 'Điểm đánh giá trung bình',
                        description: 'Tính điểm đánh giá trung bình của sản phẩm',
                        example: '(SELECT AVG(rating) FROM reviews WHERE product_id = products.id)',
                        type: 'select_scalar',
                        targetTable: 'reviews',
                        aggregateFunction: 'AVG',
                        alias: 'avg_rating'
                    }
                ];
                break;
                
            case 'orders':
                suggestions = [
                    {
                        title: 'Đơn hàng của người dùng hoạt động',
                        description: 'Tìm đơn hàng của người dùng đang hoạt động',
                        example: 'user_id IN (SELECT id FROM users WHERE status = "active")',
                        type: 'where_in',
                        targetTable: 'users',
                        field: 'user_id',
                        subqueryField: 'id'
                    }
                ];
                break;
        }
        
        return suggestions;
    },

    // Tạo sub query từ gợi ý
    createFromSuggestion: function(suggestion) {
        var subQuery = {
            type: suggestion.type,
            field: suggestion.field,
            targetTable: suggestion.targetTable,
            targetField: suggestion.subqueryField,
            aggregateFunction: suggestion.aggregateFunction,
            alias: suggestion.alias,
            conditions: {
                condition: 'AND',
                rules: []
            }
        };
        
        if (SubQueryCore.addSubQuery(subQuery)) {
            SubQueryUI.updateSubQueriesList();
            SubQueryManager.updateQueryBuilder();
            SubQueryUI.showNotification('Đã thêm truy vấn con từ gợi ý!', 'success');
        }
    }
};