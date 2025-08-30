// SubQuery Manager - Quản lý chính cho Sub Query
var SubQueryManager = {
    
    // Khởi tạo SubQuery manager
    init: function() {
        // Khởi tạo các module con
        SubQueryCore.init();
        
        // Tạo giao diện
        SubQueryUI.createInterface();
        SubQuerySuggestions.update();
        
        // Bind events
        SubQueryUI.bindEvents();
    },

    // Cập nhật QueryBuilder chính
    updateQueryBuilder: function() {
        // Trigger update cho main query builder
        setTimeout(function() {
            $('#btn-get').trigger('click');
        }, 100);
    },

    // Tạo SQL với sub queries
    generateSQL: function(mainSQL) {
        return SubQuerySQL.generateSQL(mainSQL);
    },

    // API công khai
    getSubQueries: function() {
        return SubQueryCore.subQueries;
    },

    clearAll: function() {
        SubQueryCore.clearSubQueries();
        SubQueryUI.updateSubQueriesList();
        this.updateQueryBuilder();
    }
};