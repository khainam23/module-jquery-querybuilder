// SubQuery UI - Giao diện người dùng
var SubQueryUI = {
    
    // Tạo giao diện chính
    createInterface: function() {
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
        this.createTypeCards();
    },

    // Tạo các thẻ loại sub query
    createTypeCards: function() {
        var cardsHtml = '';
        
        Object.keys(SubQueryCore.subQueryTypes).forEach(function(typeKey) {
            var type = SubQueryCore.subQueryTypes[typeKey];
            
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

    // Cập nhật danh sách sub queries
    updateSubQueriesList: function() {
        var listHtml = '';
        
        if (SubQueryCore.subQueries.length === 0) {
            listHtml = '<div class="text-sm text-gray-500 italic">Chưa có truy vấn con nào. Chọn loại truy vấn con ở trên để bắt đầu.</div>';
            $('#reset-subqueries').hide();
        } else {
            SubQueryCore.subQueries.forEach(function(subQuery) {
                var typeConfig = SubQueryCore.subQueryTypes[subQuery.type];
                var targetConfig = SubQueryCore.availableTables[subQuery.targetTable];
                
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
                                    ${SubQueryCore.generateDescription(subQuery)}
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
    },

    // Bind UI events
    bindEvents: function() {
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
            SubQueryDialog.show(type);
        });
        
        // Reset sub queries
        $(document).on('click', '#reset-subqueries', function() {
            if (confirm('Bạn có chắc chắn muốn xóa tất cả truy vấn con?')) {
                SubQueryCore.clearSubQueries();
                SubQueryUI.updateSubQueriesList();
                SubQueryManager.updateQueryBuilder();
            }
        });
        
        // Xóa sub query đơn lẻ
        $(document).on('click', '.remove-subquery', function() {
            var subqueryId = $(this).data('id');
            if (confirm('Bạn có chắc chắn muốn xóa truy vấn con này?')) {
                SubQueryCore.removeSubQuery(subqueryId);
                SubQueryUI.updateSubQueriesList();
                SubQueryManager.updateQueryBuilder();
                SubQueryUI.showNotification('Đã xóa truy vấn con!', 'success');
            }
        });
        
        // Click vào gợi ý sub query
        $(document).on('click', '.add-suggested-subquery', function(e) {
            e.stopPropagation();
            var suggestion = $(this).closest('.subquery-suggestion').data('suggestion');
            SubQuerySuggestions.createFromSuggestion(suggestion);
        });
        
        // Lắng nghe thay đổi bảng
        $(document).on('tableChanged', function(event, tableName) {
            SubQuerySuggestions.update();
        });
    }
};