// Quản lý JOIN giữa các bảng
var JoinManager = {
    joins: [],
    availableTables: {},
    relationshipMap: {},
    
    // Khởi tạo JOIN manager
    init: function() {
        this.availableTables = TableManager.tables;
        this.buildRelationshipMap();
        this.createJoinInterface();
        this.bindEvents();
    },

    // Xây dựng bản đồ quan hệ tự động
    buildRelationshipMap: function() {
        var self = this;
        this.relationshipMap = {
            // Quan hệ giữa users và orders
            'users-orders': {
                leftTable: 'users',
                rightTable: 'orders', 
                leftField: 'id',
                rightField: 'user_id',
                type: 'one-to-many',
                description: 'Một người dùng có thể có nhiều đơn hàng'
            },
            // Quan hệ giữa orders và products (thông qua order_items)
            'orders-products': {
                leftTable: 'orders',
                rightTable: 'products',
                leftField: 'id', 
                rightField: 'id',
                type: 'many-to-many',
                description: 'Một đơn hàng có thể chứa nhiều sản phẩm',
                throughTable: 'order_items',
                throughFields: ['order_id', 'product_id']
            },
            // Quan hệ giữa products và categories
            'products-categories': {
                leftTable: 'products',
                rightTable: 'categories',
                leftField: 'category_id',
                rightField: 'id',
                type: 'many-to-one',
                description: 'Nhiều sản phẩm thuộc về một danh mục'
            },
            // Quan hệ giữa products và reviews
            'products-reviews': {
                leftTable: 'products',
                rightTable: 'reviews',
                leftField: 'id',
                rightField: 'product_id',
                type: 'one-to-many',
                description: 'Một sản phẩm có thể có nhiều đánh giá'
            },
            // Quan hệ giữa users và reviews
            'users-reviews': {
                leftTable: 'users',
                rightTable: 'reviews',
                leftField: 'id',
                rightField: 'user_id',
                type: 'one-to-many',
                description: 'Một người dùng có thể viết nhiều đánh giá'
            }
        };
    },

    // Tạo giao diện JOIN
    createJoinInterface: function() {
        var joinHtml = `
            <div id="join-manager" class="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">
                            <i class="fas fa-link mr-2 text-blue-500"></i>Kết nối bảng dữ liệu
                        </h3>
                        <button id="toggle-join-panel" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">Kéo thả để kết nối các bảng và tạo truy vấn phức tạp</p>
                </div>
                
                <div id="join-panel" class="p-4">
                    <!-- Khu vực hiển thị bảng -->
                    <div id="tables-area" class="mb-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="table-cards">
                            <!-- Các thẻ bảng sẽ được tạo động -->
                        </div>
                    </div>
                    
                    <!-- Khu vực hiển thị JOIN -->
                    <div id="joins-area" class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-md font-medium text-gray-800">
                                <i class="fas fa-project-diagram mr-2"></i>Các kết nối hiện tại:
                            </h4>
                            <button id="reset-joins" class="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded border border-red-300 hover:bg-red-50" style="display: none;">
                                <i class="fas fa-trash mr-1"></i>Xóa tất cả
                            </button>
                        </div>
                        <div id="joins-list" class="space-y-2">
                            <div class="text-sm text-gray-500 italic">Chưa có kết nối nào. Kéo thả giữa các bảng để tạo kết nối.</div>
                        </div>
                    </div>
                    
                    <!-- Gợi ý quan hệ -->
                    <div id="relationship-suggestions" class="mb-4">
                        <h4 class="text-md font-medium text-gray-800 mb-2">
                            <i class="fas fa-lightbulb mr-2 text-yellow-500"></i>Gợi ý kết nối:
                        </h4>
                        <div id="suggestions-list" class="space-y-2">
                            <!-- Gợi ý sẽ được tạo động -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#builder').before(joinHtml);
        this.createTableCards();
        this.createSuggestions();
    },

    // Tạo các thẻ bảng
    createTableCards: function() {
        var self = this;
        var cardsHtml = '';
        
        Object.keys(this.availableTables).forEach(function(tableName) {
            var config = self.availableTables[tableName];
            var isActive = tableName === TableManager.currentTable;
            
            cardsHtml += `
                <div class="table-card ${isActive ? 'active' : ''}" data-table="${tableName}">
                    <div class="bg-white border-2 ${isActive ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-3 cursor-move hover:shadow-md transition-all">
                        <div class="flex items-center justify-between mb-2">
                            <h5 class="font-medium text-gray-900">${config.displayName}</h5>
                            <i class="fas fa-grip-vertical text-gray-400"></i>
                        </div>
                        <div class="text-xs text-gray-500">
                            <div><i class="fas fa-table mr-1"></i>${tableName}</div>
                            <div><i class="fas fa-list mr-1"></i>${config.filters.length} trường</div>
                        </div>
                        ${isActive ? '<div class="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Bảng chính</div>' : ''}
                    </div>
                </div>
            `;
        });
        
        $('#table-cards').html(cardsHtml);
        this.makeDraggable();
    },

    // Tạo gợi ý quan hệ
    createSuggestions: function() {
        var self = this;
        var suggestionsHtml = '';
        
        Object.keys(this.relationshipMap).forEach(function(key) {
            var rel = self.relationshipMap[key];
            var leftConfig = self.availableTables[rel.leftTable];
            var rightConfig = self.availableTables[rel.rightTable];
            
            suggestionsHtml += `
                <div class="suggestion-item bg-yellow-50 border border-yellow-200 rounded-lg p-3 cursor-pointer hover:bg-yellow-100 transition-colors" data-relationship="${key}">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="font-medium text-gray-900">
                                ${leftConfig.displayName} ↔ ${rightConfig.displayName}
                            </div>
                            <div class="text-sm text-gray-600 mt-1">${rel.description}</div>
                            <div class="text-xs text-gray-500 mt-1">
                                <span class="bg-gray-100 px-2 py-1 rounded">${rel.leftTable}.${rel.leftField}</span>
                                <i class="fas fa-arrow-right mx-2"></i>
                                <span class="bg-gray-100 px-2 py-1 rounded">${rel.rightTable}.${rel.rightField}</span>
                            </div>
                        </div>
                        <button class="add-suggested-join bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                            <i class="fas fa-plus mr-1"></i>Thêm
                        </button>
                    </div>
                </div>
            `;
        });
        
        if (suggestionsHtml === '') {
            suggestionsHtml = '<div class="text-sm text-gray-500 italic">Không có gợi ý nào.</div>';
        }
        
        $('#suggestions-list').html(suggestionsHtml);
    },

    // Làm cho các thẻ bảng có thể kéo thả
    makeDraggable: function() {
        var self = this;
        
        $('.table-card').each(function() {
            var $card = $(this);
            var tableName = $card.data('table');
            
            $card.draggable({
                helper: 'clone',
                revert: 'invalid',
                zIndex: 1000,
                start: function(event, ui) {
                    ui.helper.addClass('dragging');
                    $('.table-card').not(this).addClass('drop-target');
                },
                stop: function(event, ui) {
                    $('.table-card').removeClass('drop-target');
                }
            });
            
            $card.droppable({
                accept: '.table-card',
                hoverClass: 'drop-hover',
                drop: function(event, ui) {
                    var sourceTable = ui.draggable.data('table');
                    var targetTable = $(this).data('table');
                    
                    if (sourceTable !== targetTable) {
                        self.createJoin(sourceTable, targetTable);
                    }
                }
            });
        });
    },

    // Tạo JOIN giữa hai bảng
    createJoin: function(leftTable, rightTable) {
        var relationship = this.findRelationship(leftTable, rightTable);
        
        if (relationship) {
            var joinType = this.determineJoinType(relationship);
            var join = {
                id: 'join_' + Date.now(),
                leftTable: leftTable,
                rightTable: rightTable,
                leftField: relationship.leftField,
                rightField: relationship.rightField,
                joinType: joinType,
                relationship: relationship
            };
            
            this.joins.push(join);
            this.updateJoinsList();
            this.updateQueryBuilder();
            
            // Hiển thị thông báo thành công
            this.showNotification(`Đã kết nối ${this.availableTables[leftTable].displayName} với ${this.availableTables[rightTable].displayName}`, 'success');
        } else {
            // Hiển thị dialog để người dùng chọn trường kết nối
            this.showJoinDialog(leftTable, rightTable);
        }
    },

    // Tìm quan hệ giữa hai bảng
    findRelationship: function(table1, table2) {
        var key1 = table1 + '-' + table2;
        var key2 = table2 + '-' + table1;
        
        if (this.relationshipMap[key1]) {
            return this.relationshipMap[key1];
        } else if (this.relationshipMap[key2]) {
            // Đảo ngược quan hệ
            var rel = this.relationshipMap[key2];
            return {
                leftTable: rel.rightTable,
                rightTable: rel.leftTable,
                leftField: rel.rightField,
                rightField: rel.leftField,
                type: rel.type,
                description: rel.description
            };
        }
        
        return null;
    },

    // Xác định loại JOIN phù hợp
    determineJoinType: function(relationship) {
        switch (relationship.type) {
            case 'one-to-many':
                return 'LEFT JOIN'; // Giữ tất cả bản ghi từ bảng trái
            case 'many-to-one':
                return 'INNER JOIN'; // Chỉ lấy bản ghi có liên kết
            case 'many-to-many':
                return 'INNER JOIN'; // Cần bảng trung gian
            default:
                return 'INNER JOIN';
        }
    },

    // Hiển thị dialog chọn trường JOIN
    showJoinDialog: function(leftTable, rightTable) {
        var self = this;
        var leftConfig = this.availableTables[leftTable];
        var rightConfig = this.availableTables[rightTable];
        
        var leftFields = leftConfig.filters.map(f => `<option value="${f.id}">${f.label} (${f.id})</option>`).join('');
        var rightFields = rightConfig.filters.map(f => `<option value="${f.id}">${f.label} (${f.id})</option>`).join('');
        
        var dialogHtml = `
            <div id="join-dialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 class="text-lg font-semibold mb-4">Tạo kết nối thủ công</h3>
                    <p class="text-sm text-gray-600 mb-4">Chọn trường để kết nối giữa hai bảng:</p>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Trường từ ${leftConfig.displayName}:
                            </label>
                            <select id="left-field" class="w-full border border-gray-300 rounded px-3 py-2">
                                ${leftFields}
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Trường từ ${rightConfig.displayName}:
                            </label>
                            <select id="right-field" class="w-full border border-gray-300 rounded px-3 py-2">
                                ${rightFields}
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Loại kết nối:
                            </label>
                            <select id="join-type" class="w-full border border-gray-300 rounded px-3 py-2">
                                <option value="INNER JOIN">INNER JOIN - Chỉ lấy dữ liệu có trong cả 2 bảng</option>
                                <option value="LEFT JOIN">LEFT JOIN - Lấy tất cả từ bảng trái</option>
                                <option value="RIGHT JOIN">RIGHT JOIN - Lấy tất cả từ bảng phải</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 mt-6">
                        <button id="create-manual-join" class="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Tạo kết nối
                        </button>
                        <button id="cancel-join" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(dialogHtml);
        
        // Bind events cho dialog
        $('#create-manual-join').on('click', function() {
            var join = {
                id: 'join_' + Date.now(),
                leftTable: leftTable,
                rightTable: rightTable,
                leftField: $('#left-field').val(),
                rightField: $('#right-field').val(),
                joinType: $('#join-type').val(),
                relationship: {
                    type: 'manual',
                    description: 'Kết nối thủ công'
                }
            };
            
            self.joins.push(join);
            self.updateJoinsList();
            self.updateQueryBuilder();
            
            $('#join-dialog').remove();
            self.showNotification('Đã tạo kết nối thủ công thành công', 'success');
        });
        
        $('#cancel-join').on('click', function() {
            $('#join-dialog').remove();
        });
    },

    // Cập nhật danh sách JOIN
    updateJoinsList: function() {
        var self = this;
        var joinsHtml = '';
        
        if (this.joins.length === 0) {
            joinsHtml = '<div class="text-sm text-gray-500 italic">Chưa có kết nối nào. Kéo thả giữa các bảng để tạo kết nối.</div>';
        } else {
            this.joins.forEach(function(join) {
                var leftConfig = self.availableTables[join.leftTable];
                var rightConfig = self.availableTables[join.rightTable];
                
                joinsHtml += `
                    <div class="join-item bg-green-50 border border-green-200 rounded-lg p-3" data-join-id="${join.id}">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">${join.joinType}</span>
                                    ${leftConfig.displayName} ↔ ${rightConfig.displayName}
                                </div>
                                <div class="text-sm text-gray-600 mt-1">
                                    ${join.leftTable}.${join.leftField} = ${join.rightTable}.${join.rightField}
                                </div>
                                <div class="text-xs text-gray-500 mt-1">${join.relationship.description}</div>
                            </div>
                            <button class="remove-join text-red-500 hover:text-red-700 ml-2" data-join-id="${join.id}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        $('#joins-list').html(joinsHtml);
    },

    // Cập nhật QueryBuilder với các trường từ bảng đã JOIN
    updateQueryBuilder: function() {
        var allFilters = [];
        var tablesInvolved = [TableManager.currentTable];
        
        // Thêm trường từ bảng chính
        var currentConfig = TableManager.getCurrentConfig();
        currentConfig.filters.forEach(function(filter) {
            allFilters.push({
                ...filter,
                id: currentConfig.tableName + '.' + filter.id,
                label: `[${currentConfig.displayName}] ${filter.label}`
            });
        });
        
        // Thêm trường từ các bảng đã JOIN
        this.joins.forEach(function(join) {
            if (tablesInvolved.indexOf(join.rightTable) === -1) {
                tablesInvolved.push(join.rightTable);
                var joinConfig = TableManager.tables[join.rightTable];
                joinConfig.filters.forEach(function(filter) {
                    allFilters.push({
                        ...filter,
                        id: joinConfig.tableName + '.' + filter.id,
                        label: `[${joinConfig.displayName}] ${filter.label}`
                    });
                });
            }
        });
        
        // Cập nhật QueryBuilder
        if ($('#builder').data('queryBuilder')) {
            $('#builder').queryBuilder('destroy');
        }
        
        $('#builder').queryBuilder({
            filters: allFilters,
            rules: currentConfig.defaultRules
        });
        
        // Cập nhật thông tin bảng
        this.updateTableInfo(tablesInvolved);
    },

    // Cập nhật thông tin bảng hiển thị
    updateTableInfo: function(tablesInvolved) {
        var tableNames = tablesInvolved.map(t => this.availableTables[t].displayName).join(', ');
        var totalFields = 0;
        
        tablesInvolved.forEach(t => {
            totalFields += this.availableTables[t].filters.length;
        });
        
        var infoHtml = `
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-blue-700">
                            <strong>Bảng đang sử dụng:</strong> ${tableNames}
                            <br>
                            <strong>Tổng số trường:</strong> ${totalFields} trường
                            <br>
                            <strong>Số kết nối:</strong> ${this.joins.length} JOIN
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        $('.table-info').html(infoHtml);
    },

    // Bind events
    bindEvents: function() {
        var self = this;
        
        // Toggle JOIN panel
        $('#toggle-join-panel').on('click', function() {
            var $panel = $('#join-panel');
            var $icon = $(this).find('i');
            
            $panel.slideToggle();
            $icon.toggleClass('fa-chevron-down fa-chevron-up');
        });
        
        // Thêm gợi ý JOIN
        $(document).on('click', '.add-suggested-join', function(e) {
            e.stopPropagation();
            var relationshipKey = $(this).closest('.suggestion-item').data('relationship');
            var relationship = self.relationshipMap[relationshipKey];
            
            self.createJoin(relationship.leftTable, relationship.rightTable);
        });
        
        // Xóa JOIN
        $(document).on('click', '.remove-join', function() {
            var joinId = $(this).data('join-id');
            self.removeJoin(joinId);
        });
        
        // Reset tất cả JOIN
        $('#reset-joins').on('click', function() {
            if (confirm('Bạn có chắc muốn xóa tất cả kết nối?')) {
                self.resetJoins();
            }
        });
        
        // Cập nhật khi thay đổi bảng chính
        $(document).on('tableChanged', function(e, tableName) {
            self.updateTableCards();
            self.updateQueryBuilder();
        });
    },

    // Xóa JOIN
    removeJoin: function(joinId) {
        this.joins = this.joins.filter(j => j.id !== joinId);
        this.updateJoinsList();
        this.updateQueryBuilder();
        this.showNotification('Đã xóa kết nối', 'info');
    },

    // Cập nhật thẻ bảng khi thay đổi bảng chính
    updateTableCards: function() {
        $('.table-card').removeClass('active');
        $(`.table-card[data-table="${TableManager.currentTable}"]`).addClass('active');
        
        // Cập nhật border và badge
        $('.table-card').each(function() {
            var $card = $(this);
            var tableName = $card.data('table');
            var isActive = tableName === TableManager.currentTable;
            
            $card.find('.bg-white').removeClass('border-blue-500 border-gray-200')
                .addClass(isActive ? 'border-blue-500' : 'border-gray-200');
            
            // Xóa badge cũ và thêm badge mới nếu cần
            $card.find('.bg-blue-100').remove();
            if (isActive) {
                $card.find('.text-xs.text-gray-500').after('<div class="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Bảng chính</div>');
            }
        });
    },

    // Hiển thị thông báo
    showNotification: function(message, type) {
        var bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        var notification = `
            <div class="fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 notification">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'} mr-2"></i>
                ${message}
            </div>
        `;
        
        $('body').append(notification);
        
        setTimeout(function() {
            $('.notification').fadeOut(function() {
                $(this).remove();
            });
        }, 3000);
    },

    // Tạo SQL với JOIN
    generateJoinSQL: function(baseSQL) {
        if (this.joins.length === 0) {
            return baseSQL;
        }
        
        var fromClause = TableManager.currentTable;
        var joinClauses = [];
        
        this.joins.forEach(function(join) {
            var joinClause = `${join.joinType} ${join.rightTable} ON ${join.leftTable}.${join.leftField} = ${join.rightTable}.${join.rightField}`;
            joinClauses.push(joinClause);
        });
        
        // Thay thế FROM clause trong SQL
        var fromPattern = new RegExp(`FROM\\s+${TableManager.currentTable}`, 'i');
        var sqlWithJoins = baseSQL.replace(
            fromPattern,
            `FROM ${fromClause} ${joinClauses.join(' ')}`
        );
        
        return sqlWithJoins;
    },
    
    // Reset tất cả JOIN
    resetJoins: function() {
        this.joins = [];
        this.updateJoinsList();
        this.updateQueryBuilder();
        this.showNotification('Đã xóa tất cả kết nối', 'info');
    }
};