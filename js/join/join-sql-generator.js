// Tạo SQL với JOIN
var JoinSQLGenerator = {
    
    // Tạo SQL với JOIN
    generateJoinSQL: function(baseSQL, joins, currentTable) {
        if (joins.length === 0) {
            return baseSQL;
        }
        
        var fromClause = currentTable;
        var joinClauses = [];
        
        joins.forEach(function(join) {
            var joinClause = `${join.joinType} ${join.rightTable} ON ${join.leftTable}.${join.leftField} = ${join.rightTable}.${join.rightField}`;
            joinClauses.push(joinClause);
        });
        
        // Thay thế FROM clause trong SQL
        var fromPattern = new RegExp(`FROM\\s+${currentTable}`, 'i');
        var sqlWithJoins = baseSQL.replace(
            fromPattern,
            `FROM ${fromClause} ${joinClauses.join(' ')}`
        );
        
        return sqlWithJoins;
    },

    // Tạo danh sách các bảng liên quan
    getInvolvedTables: function(joins, currentTable) {
        var tablesInvolved = [currentTable];
        
        joins.forEach(function(join) {
            if (tablesInvolved.indexOf(join.rightTable) === -1) {
                tablesInvolved.push(join.rightTable);
            }
            if (tablesInvolved.indexOf(join.leftTable) === -1) {
                tablesInvolved.push(join.leftTable);
            }
        });
        
        return tablesInvolved;
    },

    // Tạo danh sách filters từ tất cả bảng liên quan
    generateAllFilters: function(joins, currentTable, availableTables) {
        var allFilters = [];
        var tablesInvolved = this.getInvolvedTables(joins, currentTable);
        
        // Thêm trường từ bảng chính
        var currentConfig = availableTables[currentTable];
        if (currentConfig) {
            currentConfig.filters.forEach(function(filter) {
                allFilters.push({
                    ...filter,
                    id: currentConfig.tableName + '.' + filter.id,
                    label: `[${currentConfig.displayName}] ${filter.label}`
                });
            });
        }
        
        // Thêm trường từ các bảng đã JOIN
        joins.forEach(function(join) {
            var joinConfig = availableTables[join.rightTable];
            if (joinConfig && tablesInvolved.indexOf(join.rightTable) !== -1) {
                joinConfig.filters.forEach(function(filter) {
                    allFilters.push({
                        ...filter,
                        id: joinConfig.tableName + '.' + filter.id,
                        label: `[${joinConfig.displayName}] ${filter.label}`
                    });
                });
            }
        });
        
        return allFilters;
    },

    // Validate JOIN structure
    validateJoins: function(joins) {
        var errors = [];
        
        joins.forEach(function(join, index) {
            if (!join.leftTable || !join.rightTable) {
                errors.push(`JOIN ${index + 1}: Thiếu thông tin bảng`);
            }
            
            if (!join.leftField || !join.rightField) {
                errors.push(`JOIN ${index + 1}: Thiếu thông tin trường kết nối`);
            }
            
            if (!join.joinType) {
                errors.push(`JOIN ${index + 1}: Thiếu loại JOIN`);
            }
        });
        
        return errors;
    }
};