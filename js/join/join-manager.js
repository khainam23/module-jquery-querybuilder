// Quản lý JOIN giữa các bảng - File chính tích hợp
var JoinManager = {
    joins: [],
    availableTables: {},
    
    // Khởi tạo JOIN manager
    init: function() {
        this.availableTables = TableManager.tables;
        
        // Khởi tạo các module con
        JoinRelationships.buildRelationshipMap();
        JoinUI.init(this.availableTables);
        JoinDragDrop.init(this.createJoin.bind(this));
        JoinDialog.init(this.availableTables, this.addManualJoin.bind(this));
        
        // Tạo giao diện và bind events
        JoinUI.createJoinInterface();
        JoinDragDrop.makeDraggable();
        this.bindEvents();
    },

    // Tạo JOIN giữa hai bảng (từ drag & drop)
    createJoin: function(leftTable, rightTable) {
        var relationship = JoinRelationships.findRelationship(leftTable, rightTable);
        
        if (relationship) {
            var joinType = JoinRelationships.determineJoinType(relationship);
            var join = {
                id: 'join_' + Date.now(),
                leftTable: leftTable,
                rightTable: rightTable,
                leftField: relationship.leftField,
                rightField: relationship.rightField,
                joinType: joinType,
                relationship: relationship
            };
            
            this.addJoin(join);
            
            // Hiển thị thông báo thành công
            JoinUI.showNotification(`Đã kết nối ${this.availableTables[leftTable].displayName} với ${this.availableTables[rightTable].displayName}`, 'success');
        } else {
            // Hiển thị dialog để người dùng chọn trường kết nối
            JoinDialog.show(leftTable, rightTable);
        }
    },

    // Thêm JOIN thủ công (từ dialog)
    addManualJoin: function(join) {
        this.addJoin(join);
        JoinUI.showNotification('Đã tạo kết nối thủ công thành công', 'success');
    },

    // Thêm JOIN vào danh sách
    addJoin: function(join) {
        // Kiểm tra xem JOIN đã tồn tại chưa
        var existingJoin = this.joins.find(j => 
            (j.leftTable === join.leftTable && j.rightTable === join.rightTable) ||
            (j.leftTable === join.rightTable && j.rightTable === join.leftTable)
        );
        
        if (existingJoin) {
            JoinUI.showNotification('Kết nối giữa hai bảng này đã tồn tại', 'error');
            return;
        }
        
        this.joins.push(join);
        this.updateUI();
        this.updateQueryBuilder();
    },

    // Cập nhật giao diện
    updateUI: function() {
        JoinUI.updateJoinsList(this.joins);
        
        var tablesInvolved = JoinSQLGenerator.getInvolvedTables(this.joins, TableManager.currentTable);
        JoinUI.updateTableInfo(tablesInvolved, this.joins.length);
    },

    // Cập nhật QueryBuilder với các trường từ bảng đã JOIN
    updateQueryBuilder: function() {
        var allFilters = JoinSQLGenerator.generateAllFilters(
            this.joins, 
            TableManager.currentTable, 
            this.availableTables
        );
        
        // Cập nhật QueryBuilder
        if ($('#builder').data('queryBuilder')) {
            $('#builder').queryBuilder('destroy');
        }
        
        var currentConfig = TableManager.getCurrentConfig();
        $('#builder').queryBuilder({
            filters: allFilters,
            rules: currentConfig.defaultRules
        });
        
        this.updateUI();
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
            var relationshipMap = JoinRelationships.getAllRelationships();
            var relationship = relationshipMap[relationshipKey];
            
            if (relationship) {
                self.createJoin(relationship.leftTable, relationship.rightTable);
            }
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
        this.updateUI();
        this.updateQueryBuilder();
        JoinUI.showNotification('Đã xóa kết nối', 'info');
    },

    // Cập nhật thẻ bảng khi thay đổi bảng chính
    updateTableCards: function() {
        JoinUI.updateTableCards();
        JoinDragDrop.updateDraggable();
    },

    // Tạo SQL với JOIN
    generateJoinSQL: function(baseSQL) {
        return JoinSQLGenerator.generateJoinSQL(baseSQL, this.joins, TableManager.currentTable);
    },
    
    // Reset tất cả JOIN
    resetJoins: function() {
        this.joins = [];
        this.updateUI();
        this.updateQueryBuilder();
        JoinUI.showNotification('Đã xóa tất cả kết nối', 'info');
    },

    // Lấy danh sách JOIN hiện tại
    getJoins: function() {
        return this.joins;
    },

    // Validate tất cả JOIN
    validateJoins: function() {
        return JoinSQLGenerator.validateJoins(this.joins);
    }
};