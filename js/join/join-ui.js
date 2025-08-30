// Quản lý giao diện JOIN
var JoinUI = {
    availableTables: {},
    
    // Khởi tạo
    init: function(availableTables) {
        this.availableTables = availableTables;
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
    },

    // Tạo gợi ý quan hệ
    createSuggestions: function() {
        var self = this;
        var suggestionsHtml = '';
        var relationshipMap = JoinRelationships.getAllRelationships();
        
        Object.keys(relationshipMap).forEach(function(key) {
            var rel = relationshipMap[key];
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

    // Cập nhật danh sách JOIN
    updateJoinsList: function(joins) {
        var self = this;
        var joinsHtml = '';
        
        if (joins.length === 0) {
            joinsHtml = '<div class="text-sm text-gray-500 italic">Chưa có kết nối nào. Kéo thả giữa các bảng để tạo kết nối.</div>';
            $('#reset-joins').hide();
        } else {
            joins.forEach(function(join) {
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
            $('#reset-joins').show();
        }
        
        $('#joins-list').html(joinsHtml);
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

    // Cập nhật thông tin bảng hiển thị
    updateTableInfo: function(tablesInvolved, joinsCount) {
        var tableNames = tablesInvolved.map(t => this.availableTables[t].displayName).join(', ');
        var totalFields = 0;
        
        var self = this;
        tablesInvolved.forEach(function(t) {
            totalFields += self.availableTables[t].filters.length;
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
                            <strong>Số kết nối:</strong> ${joinsCount} JOIN
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        $('.table-info').html(infoHtml);
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
    }
};