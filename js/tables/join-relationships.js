// Quản lý quan hệ giữa các bảng
var JoinRelationships = {
    relationshipMap: {},
    
    // Xây dựng bản đồ quan hệ tự động
    buildRelationshipMap: function() {
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

    // Lấy tất cả quan hệ
    getAllRelationships: function() {
        return this.relationshipMap;
    }
};