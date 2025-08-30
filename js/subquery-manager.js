// Quản lý Sub Query - Truy vấn con
var SubQueryManager = {
    subQueries: [],
    availableTables: {},
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
    
    // Khởi tạo SubQuery manager
    init: function() {
        // Kiểm tra xem TableManager đã sẵn sàng chưa
        if (typeof TableManager === 'undefined' || !TableManager.tables) {
            console.error('TableManager chưa sẵn sàng. SubQueryManager sẽ thử lại sau.');
            setTimeout(this.init.bind(this), 200);
            return;
        }
        
        this.availableTables = TableManager.tables;
        this.createSubQueryInterface();
        this.bindEvents();
    },

    // Tạo giao diện Sub Query
    createSubQueryInterface: function() {
        var subQueryHtml = `
            <div id="subquery-manager" class="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">
                            <i class="fas fa-layer-group mr-2 text-purple-500"></i>Truy vấn con (Sub Query)
                        </h3>
                        <button id="toggle-subquery-panel" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">Tạo điều kiện phức tạp bằng cách sử dụng kết quả từ truy vấn khác</p>
                </div>
                
                <div id="subquery-panel" class="p-4">
                    <!-- Khu vực tạo Sub Query mới -->
                    <div id="create-subquery-area" class="mb-6">
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h4 class="text-md font-medium text-gray-800 mb-3">
                                <i class="fas fa-plus-circle mr-2 text-purple-500"></i>Tạo truy vấn con mới:
                            </h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="subquery-type-cards">
                                <!-- Các thẻ loại sub query sẽ được tạo động -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Khu vực hiển thị Sub Query hiện tại -->
                    <div id="subqueries-area" class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-md font-medium text-gray-800">
                                <i class="fas fa-layer-group mr-2"></i>Các truy vấn con hiện tại:
                            </h4>
                            <button id="reset-subqueries" class="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded border border-red-300 hover:bg-red-50" style="display: none;">
                                <i class="fas fa-trash mr-1"></i>Xóa tất cả
                            </button>
                        </div>
                        <div id="subqueries-list" class="space-y-3">
                            <div class="text-sm text-gray-500 italic">Chưa có truy vấn con nào. Chọn loại truy vấn con ở trên để bắt đầu.</div>
                        </div>
                    </div>
                    
                    <!-- Gợi ý Sub Query -->
                    <div id="subquery-suggestions" class="mb-4">
                        <h4 class="text-md font-medium text-gray-800 mb-2">
                            <i class="fas fa-lightbulb mr-2 text-yellow-500"></i>Gợi ý truy vấn con phổ biến:
                        </h4>
                        <div id="subquery-suggestions-list" class="space-y-2">
                            <!-- Gợi ý sẽ được tạo động -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#builder').before(subQueryHtml);
        this.createSubQueryTypeCards();
        this.createSubQuerySuggestions();
    },

    // Tạo các thẻ loại Sub Query
    createSubQueryTypeCards: function() {
        var self = this;
        var cardsHtml = '';
        
        Object.keys(this.subQueryTypes).forEach(function(typeKey) {
            var type = self.subQueryTypes[typeKey];
            
            cardsHtml += `
                <div class="subquery-type-card cursor-pointer" data-type="${typeKey}">
                    <div class="bg-white border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 hover:shadow-md transition-all">
                        <div class="text-center">
                            <div class="mb-2">
                                <i class="${type.icon} text-2xl text-purple-500"></i>
                            </div>
                            <h5 class="font-medium text-gray-900 mb-1">${type.name}</h5>
                            <p class="text-xs text-gray-600">${type.description}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        $('#subquery-type-cards').html(cardsHtml);
    },

    // Tạo gợi ý Sub Query
    createSubQuerySuggestions: function() {
        // Kiểm tra xem TableManager có sẵn sàng không
        if (typeof TableManager === 'undefined' || !TableManager.getCurrentTableName) {
            $('#subquery-suggestions-list').html('<div class="text-sm text-gray-500 italic">Đang tải gợi ý...</div>');
            return;
        }
        
        var currentTable = TableManager.getCurrentTableName();
        var suggestionsHtml = '';
        
        // Gợi ý dựa trên bảng hiện tại
        var suggestions = this.generateSuggestions(currentTable);
        
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
                        title: 'Người dùng có đánh giá',
                        description: 'Tìm người dùng đã viết đánh giá',
                        example: 'user_id IN (SELECT user_id FROM reviews)',
                        type: 'where_in',
                        targetTable: 'reviews',
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
                        title: 'Sản phẩm trong đơn hàng',
                        description: 'Tìm sản phẩm đã được bán',
                        example: 'EXISTS (SELECT 1 FROM order_items WHERE product_id = products.id)',
                        type: 'where_exists',
                        targetTable: 'order_items',
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
                    },
                    {
                        title: 'Tổng giá trị đơn hàng',
                        description: 'Tính tổng giá trị các sản phẩm trong đơn hàng',
                        example: '(SELECT SUM(price * quantity) FROM order_items WHERE order_id = orders.id)',
                        type: 'select_scalar',
                        targetTable: 'order_items',
                        aggregateFunction: 'SUM',
                        alias: 'total_amount'
                    }
                ];
                break;
        }
        
        return suggestions;
    },

    // Bind events
    bindEvents: function() {
        var self = this;
        
        // Toggle panel
        $(document).on('click', '#toggle-subquery-panel', function() {
            var $panel = $('#subquery-panel');
            var $icon = $(this).find('i');
            
            $panel.slideToggle();
            $icon.toggleClass('fa-chevron-down fa-chevron-up');
        });
        
        // Click vào thẻ loại sub query
        $(document).on('click', '.subquery-type-card', function() {
            var type = $(this).data('type');
            self.showSubQueryDialog(type);
        });
        
        // Click vào gợi ý sub query
        $(document).on('click', '.add-suggested-subquery', function(e) {
            e.stopPropagation();
            var suggestion = $(this).closest('.subquery-suggestion').data('suggestion');
            self.createSubQueryFromSuggestion(suggestion);
        });
        
        // Reset sub queries
        $(document).on('click', '#reset-subqueries', function() {
            if (confirm('Bạn có chắc chắn muốn xóa tất cả truy vấn con?')) {
                self.subQueries = [];
                self.updateSubQueriesList();
                self.updateQueryBuilder();
            }
        });
        
        // Xóa sub query đơn lẻ
        $(document).on('click', '.remove-subquery', function() {
            var subqueryId = $(this).data('id');
            self.removeSubQuery(subqueryId);
        });
        
        // Chỉnh sửa sub query
        $(document).on('click', '.edit-subquery', function() {
            var subqueryId = $(this).data('id');
            self.editSubQuery(subqueryId);
        });
        
        // Lắng nghe thay đổi bảng
        $(document).on('tableChanged', function(event, tableName) {
            self.createSubQuerySuggestions();
        });
    },

    // Hiển thị dialog tạo Sub Query
    showSubQueryDialog: function(type) {
        var self = this;
        var typeConfig = this.subQueryTypes[type];
        
        // Kiểm tra TableManager
        if (typeof TableManager === 'undefined' || !TableManager.getCurrentTableName) {
            this.showNotification('Lỗi: TableManager chưa sẵn sàng', 'error');
            return;
        }
        
        var currentTable = TableManager.getCurrentTableName();
        var currentConfig = TableManager.getCurrentConfig();
        
        // Tạo options cho bảng
        var tableOptions = '';
        Object.keys(this.availableTables).forEach(function(tableName) {
            var config = self.availableTables[tableName];
            var selected = tableName === currentTable ? 'selected' : '';
            tableOptions += `<option value="${tableName}" ${selected}>${config.displayName} (${tableName})</option>`;
        });
        
        // Tạo options cho trường của bảng hiện tại
        var currentFieldOptions = '';
        if (type.startsWith('where_') && !type.includes('exists')) {
            currentConfig.filters.forEach(function(filter) {
                currentFieldOptions += `<option value="${filter.id}">${filter.label} (${filter.id})</option>`;
            });
        }
        
        var dialogHtml = `
            <div id="subquery-dialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">
                            <i class="${typeConfig.icon} mr-2 text-purple-500"></i>
                            Tạo truy vấn con: ${typeConfig.name}
                        </h3>
                        <button id="close-subquery-dialog" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                        <p class="text-sm text-purple-700">${typeConfig.description}</p>
                    </div>
                    
                    <div class="space-y-4">
                        ${this.generateDialogFields(type, tableOptions, currentFieldOptions)}
                    </div>
                    
                    <div class="flex justify-end space-x-3 mt-6">
                        <button id="cancel-subquery" class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                            Hủy
                        </button>
                        <button id="create-subquery" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                            <i class="fas fa-plus mr-2"></i>Tạo truy vấn con
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(dialogHtml);
        
        // Bind dialog events
        this.bindDialogEvents(type);
    },

    // Tạo các trường trong dialog dựa trên loại sub query
    generateDialogFields: function(type, tableOptions, currentFieldOptions) {
        var fields = '';
        
        if (type.startsWith('where_') && !type.includes('exists')) {
            fields += `
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Trường để so sánh:
                    </label>
                    <select id="subquery-field" class="w-full border border-gray-300 rounded px-3 py-2">
                        ${currentFieldOptions}
                    </select>
                </div>
            `;
        }
        
        fields += `
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Bảng cho truy vấn con:
                </label>
                <select id="subquery-table" class="w-full border border-gray-300 rounded px-3 py-2">
                    ${tableOptions}
                </select>
            </div>
            
            <div id="subquery-target-field-container">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Trường trả về từ truy vấn con:
                </label>
                <select id="subquery-target-field" class="w-full border border-gray-300 rounded px-3 py-2">
                    <!-- Sẽ được cập nhật khi chọn bảng -->
                </select>
            </div>
        `;
        
        if (type === 'select_scalar') {
            fields += `
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Hàm tổng hợp:
                    </label>
                    <select id="aggregate-function" class="w-full border border-gray-300 rounded px-3 py-2">
                        <option value="COUNT">COUNT - Đếm số lượng</option>
                        <option value="SUM">SUM - Tổng</option>
                        <option value="AVG">AVG - Trung bình</option>
                        <option value="MAX">MAX - Giá trị lớn nhất</option>
                        <option value="MIN">MIN - Giá trị nhỏ nhất</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Tên hiển thị (alias):
                    </label>
                    <input type="text" id="subquery-alias" class="w-full border border-gray-300 rounded px-3 py-2" placeholder="Ví dụ: total_orders">
                </div>
            `;
        }
        
        fields += `
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Điều kiện cho truy vấn con:
                </label>
                <div id="subquery-builder" class="border border-gray-300 rounded p-2">
                    <!-- QueryBuilder con sẽ được tạo ở đây -->
                </div>
            </div>
        `;
        
        return fields;
    },

    // Bind events cho dialog
    bindDialogEvents: function(type) {
        var self = this;
        
        // Đóng dialog
        $(document).on('click', '#close-subquery-dialog, #cancel-subquery', function() {
            $('#subquery-dialog').remove();
        });
        
        // Thay đổi bảng target
        $(document).on('change', '#subquery-table', function() {
            var tableName = $(this).val();
            self.updateTargetFieldOptions(tableName);
            self.updateSubQueryBuilder(tableName);
        });
        
        // Tạo sub query
        $(document).on('click', '#create-subquery', function() {
            self.createSubQueryFromDialog(type);
        });
        
        // Khởi tạo ban đầu
        var initialTable = $('#subquery-table').val();
        this.updateTargetFieldOptions(initialTable);
        this.updateSubQueryBuilder(initialTable);
    },

    // Cập nhật options cho trường target
    updateTargetFieldOptions: function(tableName) {
        var config = this.availableTables[tableName];
        var options = '';
        
        config.filters.forEach(function(filter) {
            options += `<option value="${filter.id}">${filter.label} (${filter.id})</option>`;
        });
        
        $('#subquery-target-field').html(options);
    },

    // Cập nhật QueryBuilder con
    updateSubQueryBuilder: function(tableName) {
        var config = this.availableTables[tableName];
        
        // Destroy existing builder
        if ($('#subquery-builder').data('queryBuilder')) {
            try {
                $('#subquery-builder').queryBuilder('destroy');
            } catch (e) {
                // Ignore destroy errors
            }
        }
        
        // Clear the container first
        $('#subquery-builder').empty();
        
        // Create new builder with clean config - no default rules
        try {
            $('#subquery-builder').queryBuilder({
                filters: config.filters
                // Don't pass any rules initially
            });
        } catch (error) {
            console.error('Error creating subquery builder:', error);
            // Fallback: create simple text input
            $('#subquery-builder').html('<p class="text-sm text-gray-500">QueryBuilder không thể khởi tạo. Vui lòng thử lại.</p>');
        }
    },

    // Tạo Sub Query từ dialog
    createSubQueryFromDialog: function(type) {
        var conditions = {
            condition: 'AND',
            rules: []
        };
        
        // Safely get conditions from QueryBuilder
        try {
            if ($('#subquery-builder').data('queryBuilder')) {
                var builderRules = $('#subquery-builder').queryBuilder('getRules');
                if (builderRules && builderRules.rules) {
                    conditions = builderRules;
                }
            }
        } catch (error) {
            console.error('Error getting rules from subquery builder:', error);
            // Use default empty conditions
        }
        
        var subQuery = {
            id: 'subquery_' + Date.now(),
            type: type,
            field: $('#subquery-field').val(),
            targetTable: $('#subquery-table').val(),
            targetField: $('#subquery-target-field').val(),
            aggregateFunction: $('#aggregate-function').val(),
            alias: $('#subquery-alias').val(),
            conditions: conditions
        };
        
        // Validate
        if (!this.validateSubQuery(subQuery)) {
            return;
        }
        
        this.subQueries.push(subQuery);
        this.updateSubQueriesList();
        this.updateQueryBuilder();
        
        $('#subquery-dialog').remove();
        this.showNotification('Đã tạo truy vấn con thành công!', 'success');
    },

    // Tạo Sub Query từ gợi ý
    createSubQueryFromSuggestion: function(suggestion) {
        var subQuery = {
            id: 'subquery_' + Date.now(),
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
        
        this.subQueries.push(subQuery);
        this.updateSubQueriesList();
        this.updateQueryBuilder();
        
        this.showNotification('Đã thêm truy vấn con từ gợi ý!', 'success');
    },

    // Validate Sub Query
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

    // Cập nhật danh sách Sub Query
    updateSubQueriesList: function() {
        var self = this;
        var listHtml = '';
        
        if (this.subQueries.length === 0) {
            listHtml = '<div class="text-sm text-gray-500 italic">Chưa có truy vấn con nào. Chọn loại truy vấn con ở trên để bắt đầu.</div>';
            $('#reset-subqueries').hide();
        } else {
            this.subQueries.forEach(function(subQuery) {
                var typeConfig = self.subQueryTypes[subQuery.type];
                var targetConfig = self.availableTables[subQuery.targetTable];
                
                listHtml += `
                    <div class="subquery-item bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <i class="${typeConfig.icon} mr-2 text-purple-500"></i>
                                    <span class="font-medium text-gray-900">${typeConfig.name}</span>
                                    ${subQuery.alias ? `<span class="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">${subQuery.alias}</span>` : ''}
                                </div>
                                
                                <div class="text-sm text-gray-600 mb-2">
                                    ${self.generateSubQueryDescription(subQuery)}
                                </div>
                                
                                <div class="text-xs text-gray-500">
                                    <span class="bg-gray-100 px-2 py-1 rounded mr-2">
                                        Bảng: ${targetConfig.displayName}
                                    </span>
                                    <span class="bg-gray-100 px-2 py-1 rounded">
                                        Điều kiện: ${subQuery.conditions.rules.length} rule(s)
                                    </span>
                                </div>
                            </div>
                            
                            <div class="flex space-x-2 ml-4">
                                <button class="edit-subquery text-blue-500 hover:text-blue-700 p-1" data-id="${subQuery.id}" title="Chỉnh sửa">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="remove-subquery text-red-500 hover:text-red-700 p-1" data-id="${subQuery.id}" title="Xóa">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            $('#reset-subqueries').show();
        }
        
        $('#subqueries-list').html(listHtml);
    },

    // Tạo mô tả cho Sub Query
    generateSubQueryDescription: function(subQuery) {
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
    },

    // Xóa Sub Query
    removeSubQuery: function(subqueryId) {
        if (confirm('Bạn có chắc chắn muốn xóa truy vấn con này?')) {
            this.subQueries = this.subQueries.filter(sq => sq.id !== subqueryId);
            this.updateSubQueriesList();
            this.updateQueryBuilder();
            this.showNotification('Đã xóa truy vấn con!', 'success');
        }
    },

    // Chỉnh sửa Sub Query
    editSubQuery: function(subqueryId) {
        var subQuery = this.subQueries.find(sq => sq.id === subqueryId);
        if (subQuery) {
            // Tạm thời chỉ hiển thị thông báo, có thể mở rộng sau
            alert('Tính năng chỉnh sửa sẽ được phát triển trong phiên bản tiếp theo');
        }
    },

    // Cập nhật QueryBuilder chính
    updateQueryBuilder: function() {
        // Trigger update cho main query builder
        setTimeout(function() {
            $('#btn-get').trigger('click');
        }, 100);
    },

    // Tạo SQL cho Sub Query
    generateSubQuerySQL: function(mainSQL) {
        if (this.subQueries.length === 0) {
            return mainSQL;
        }
        
        var self = this;
        var modifiedSQL = mainSQL;
        var selectSubQueries = [];
        var whereSubQueries = [];
        
        this.subQueries.forEach(function(subQuery) {
            var subQuerySQL = self.buildSubQuerySQL(subQuery);
            
            if (subQuery.type === 'select_scalar') {
                selectSubQueries.push(`(${subQuerySQL}) as ${subQuery.alias}`);
            } else {
                var condition = self.buildWhereCondition(subQuery, subQuerySQL);
                whereSubQueries.push(condition);
            }
        });
        
        // Thêm SELECT sub queries
        if (selectSubQueries.length > 0) {
            modifiedSQL = modifiedSQL.replace(/SELECT\s+(.+?)\s+FROM/i, function(match, selectPart) {
                return `SELECT ${selectPart}, ${selectSubQueries.join(', ')} FROM`;
            });
        }
        
        // Thêm WHERE sub queries
        if (whereSubQueries.length > 0) {
            var whereClause = whereSubQueries.join(' AND ');
            if (modifiedSQL.includes('WHERE')) {
                modifiedSQL = modifiedSQL.replace(/WHERE\s+(.+?)(\s+ORDER|\s+GROUP|\s+LIMIT|$)/i, function(match, wherePart, rest) {
                    return `WHERE (${wherePart}) AND (${whereClause})${rest}`;
                });
            } else {
                modifiedSQL = modifiedSQL.replace(/(\s+ORDER|\s+GROUP|\s+LIMIT|$)/i, function(match, rest) {
                    return ` WHERE ${whereClause}${rest}`;
                });
            }
        }
        
        return modifiedSQL;
    },

    // Xây dựng SQL cho một Sub Query
    buildSubQuerySQL: function(subQuery) {
        var targetConfig = this.availableTables[subQuery.targetTable];
        var sql = '';
        
        // Tạo SELECT part
        if (subQuery.type === 'select_scalar') {
            if (subQuery.aggregateFunction === 'COUNT') {
                sql = `SELECT COUNT(*) FROM ${subQuery.targetTable}`;
            } else {
                sql = `SELECT ${subQuery.aggregateFunction}(${subQuery.targetField}) FROM ${subQuery.targetTable}`;
            }
        } else if (subQuery.type.includes('exists')) {
            sql = `SELECT 1 FROM ${subQuery.targetTable}`;
        } else {
            sql = `SELECT ${subQuery.targetField} FROM ${subQuery.targetTable}`;
        }
        
        // Thêm WHERE conditions nếu có
        if (subQuery.conditions && subQuery.conditions.rules && subQuery.conditions.rules.length > 0) {
            try {
                // Tạo temporary QueryBuilder để generate SQL
                var tempDiv = $('<div>').appendTo('body').hide();
                tempDiv.queryBuilder({
                    filters: targetConfig.filters
                });
                
                // Set rules sau khi khởi tạo
                tempDiv.queryBuilder('setRules', subQuery.conditions);
                
                var conditionSQL = tempDiv.queryBuilder('getSQL');
                if (conditionSQL && conditionSQL.sql) {
                    // Lấy phần WHERE từ SQL được tạo
                    var whereMatch = conditionSQL.sql.match(/WHERE\s+(.+?)(\s+ORDER|\s+GROUP|\s+LIMIT|$)/i);
                    if (whereMatch) {
                        sql += ` WHERE ${whereMatch[1]}`;
                    }
                }
                
                tempDiv.queryBuilder('destroy');
                tempDiv.remove();
            } catch (error) {
                console.error('Error building subquery SQL:', error);
                // Fallback: tạo WHERE clause đơn giản
                if (subQuery.conditions.rules.length > 0) {
                    var simpleConditions = [];
                    subQuery.conditions.rules.forEach(function(rule) {
                        if (rule.id && rule.operator && rule.value !== undefined) {
                            simpleConditions.push(`${rule.id} ${rule.operator} '${rule.value}'`);
                        }
                    });
                    if (simpleConditions.length > 0) {
                        sql += ` WHERE ${simpleConditions.join(' AND ')}`;
                    }
                }
            }
        }
        
        return sql;
    },

    // Xây dựng điều kiện WHERE cho Sub Query
    buildWhereCondition: function(subQuery, subQuerySQL) {
        var typeConfig = this.subQueryTypes[subQuery.type];
        var condition = '';
        
        switch(subQuery.type) {
            case 'where_in':
                condition = `${subQuery.field} IN (${subQuerySQL})`;
                break;
            case 'where_not_in':
                condition = `${subQuery.field} NOT IN (${subQuerySQL})`;
                break;
            case 'where_exists':
                condition = `EXISTS (${subQuerySQL})`;
                break;
            case 'where_not_exists':
                condition = `NOT EXISTS (${subQuerySQL})`;
                break;
        }
        
        return condition;
    },

    // Hiển thị thông báo
    showNotification: function(message, type) {
        var bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        var notification = `
            <div class="notification fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50">
                <div class="flex items-center">
                    <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'} mr-2"></i>
                    ${message}
                </div>
            </div>
        `;
        
        $('body').append(notification);
        
        setTimeout(function() {
            $('.notification').fadeOut(function() {
                $(this).remove();
            });
        }, 3000);
    }
};