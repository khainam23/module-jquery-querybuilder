// SubQuery Dialog - Quản lý dialog tạo sub query
var SubQueryDialog = {
    
    // Hiển thị dialog tạo sub query
    show: function(type) {
        var typeConfig = SubQueryCore.subQueryTypes[type];
        
        // Kiểm tra TableManager
        if (typeof TableManager === 'undefined' || !TableManager.getCurrentTableName) {
            SubQueryUI.showNotification('Lỗi: TableManager chưa sẵn sàng', 'error');
            return;
        }
        
        var currentTable = TableManager.getCurrentTableName();
        var currentConfig = TableManager.getCurrentConfig();
        
        // Tạo options cho bảng
        var tableOptions = '';
        Object.keys(SubQueryCore.availableTables).forEach(function(tableName) {
            var config = SubQueryCore.availableTables[tableName];
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
        this.bindDialogEvents(type);
    },

    // Tạo các trường trong dialog
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
            self.createSubQuery(type);
        });
        
        // Khởi tạo ban đầu
        var initialTable = $('#subquery-table').val();
        this.updateTargetFieldOptions(initialTable);
        this.updateSubQueryBuilder(initialTable);
    },

    // Cập nhật options cho trường target
    updateTargetFieldOptions: function(tableName) {
        var config = SubQueryCore.availableTables[tableName];
        var options = '';
        
        config.filters.forEach(function(filter) {
            options += `<option value="${filter.id}">${filter.label} (${filter.id})</option>`;
        });
        
        $('#subquery-target-field').html(options);
    },

    // Cập nhật QueryBuilder con
    updateSubQueryBuilder: function(tableName) {
        var config = SubQueryCore.availableTables[tableName];
        
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
        
        // Create new builder
        try {
            $('#subquery-builder').queryBuilder({
                filters: config.filters
            });
        } catch (error) {
            console.error('Error creating subquery builder:', error);
            $('#subquery-builder').html('<p class="text-sm text-gray-500">QueryBuilder không thể khởi tạo. Vui lòng thử lại.</p>');
        }
    },

    // Tạo sub query từ dialog
    createSubQuery: function(type) {
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
        }
        
        var subQuery = {
            type: type,
            field: $('#subquery-field').val(),
            targetTable: $('#subquery-table').val(),
            targetField: $('#subquery-target-field').val(),
            aggregateFunction: $('#aggregate-function').val(),
            alias: $('#subquery-alias').val(),
            conditions: conditions
        };
        
        // Validate và thêm
        if (SubQueryCore.addSubQuery(subQuery)) {
            SubQueryUI.updateSubQueriesList();
            SubQueryManager.updateQueryBuilder();
            $('#subquery-dialog').remove();
            SubQueryUI.showNotification('Đã tạo truy vấn con thành công!', 'success');
        }
    }
};