// Quản lý dialog tạo JOIN thủ công
var JoinDialog = {
    availableTables: {},
    onJoinCreated: null, // Callback khi tạo JOIN
    
    // Khởi tạo
    init: function(availableTables, onJoinCreatedCallback) {
        this.availableTables = availableTables;
        this.onJoinCreated = onJoinCreatedCallback;
    },

    // Hiển thị dialog chọn trường JOIN
    show: function(leftTable, rightTable) {
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
            
            if (self.onJoinCreated) {
                self.onJoinCreated(join);
            }
            
            self.close();
        });
        
        $('#cancel-join').on('click', function() {
            self.close();
        });

        // Đóng dialog khi click outside
        $('#join-dialog').on('click', function(e) {
            if (e.target === this) {
                self.close();
            }
        });

        // Đóng dialog khi nhấn ESC
        $(document).on('keydown.joinDialog', function(e) {
            if (e.keyCode === 27) { // ESC key
                self.close();
            }
        });
    },

    // Đóng dialog
    close: function() {
        $('#join-dialog').remove();
        $(document).off('keydown.joinDialog');
    }
};