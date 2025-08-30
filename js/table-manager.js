// Quản lý các bảng và chuyển đổi giữa chúng
var TableManager = {
    currentTable: 'users',
    tables: {
        'users': usersTableConfig,
        'products': productsTableConfig,
        'orders': ordersTableConfig,
        'categories': categoriesTableConfig,
        'reviews': reviewsTableConfig
    },

    // Khởi tạo table manager
    init: function() {
        this.createTableSelector();
        this.loadTable(this.currentTable);
        this.bindEvents();
    },

    // Tạo dropdown selector cho tables
    createTableSelector: function() {
        var selectorHtml = `
            <div class="mb-4">
                <label for="table-selector" class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-table mr-2"></i>Chọn bảng dữ liệu:
                </label>
                <select id="table-selector" class="form-select w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="users">👥 Người dùng</option>
                    <option value="products">📦 Sản phẩm</option>
                    <option value="orders">🛒 Đơn hàng</option>
                    <option value="categories">📂 Danh mục</option>
                    <option value="reviews">⭐ Đánh giá</option>
                </select>
            </div>
        `;
        
        $('#builder').before(selectorHtml);
    },

    // Bind events
    bindEvents: function() {
        var self = this;
        
        $('#table-selector').on('change', function() {
            var selectedTable = $(this).val();
            self.loadTable(selectedTable);
        });
    },

    // Load table configuration
    loadTable: function(tableName) {
        if (!this.tables[tableName]) {
            console.error('Table not found:', tableName);
            return;
        }

        this.currentTable = tableName;
        var config = this.tables[tableName];
        
        // Destroy existing QueryBuilder
        if ($('#builder').data('queryBuilder')) {
            $('#builder').queryBuilder('destroy');
        }

        // Create new QueryBuilder with selected table config
        var queryBuilderConfig = {
            filters: config.filters,
            rules: config.defaultRules
        };

        $('#builder').queryBuilder(queryBuilderConfig);
        
        // Update table info display
        this.updateTableInfo(config);
        
        // Trigger initial query generation
        setTimeout(function() {
            $('#btn-get').trigger('click');
        }, 500);
    },

    // Update table information display
    updateTableInfo: function(config) {
        var infoHtml = `
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-blue-700">
                            <strong>Bảng hiện tại:</strong> ${config.displayName} (${config.tableName})
                            <br>
                            <strong>Số trường:</strong> ${config.filters.length} trường
                            <br>
                            <strong>Rules mặc định:</strong> ${config.defaultRules.rules.length} điều kiện
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing info
        $('.table-info').remove();
        
        // Add new info
        $('#builder').before('<div class="table-info">' + infoHtml + '</div>');
    },

    // Get current table config
    getCurrentConfig: function() {
        return this.tables[this.currentTable];
    },

    // Get current table name
    getCurrentTableName: function() {
        return this.currentTable;
    },

    // Get all available tables
    getAvailableTables: function() {
        return Object.keys(this.tables);
    }
};