// SubQuery SQL - Tạo SQL cho sub queries
var SubQuerySQL = {
    
    // Tạo SQL cho Sub Query
    generateSQL: function(mainSQL) {
        if (SubQueryCore.subQueries.length === 0) {
            return mainSQL;
        }
        
        var modifiedSQL = mainSQL;
        var selectSubQueries = [];
        var whereSubQueries = [];
        
        SubQueryCore.subQueries.forEach(function(subQuery) {
            var subQuerySQL = SubQuerySQL.buildSubQuerySQL(subQuery);
            
            if (subQuery.type === 'select_scalar') {
                selectSubQueries.push(`(${subQuerySQL}) as ${subQuery.alias}`);
            } else {
                var condition = SubQuerySQL.buildWhereCondition(subQuery, subQuerySQL);
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
        var targetConfig = SubQueryCore.availableTables[subQuery.targetTable];
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
    }
};