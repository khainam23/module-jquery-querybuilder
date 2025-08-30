// Xử lý kéo thả cho JOIN
var JoinDragDrop = {
    onJoinCreated: null, // Callback khi tạo JOIN
    
    // Khởi tạo
    init: function(onJoinCreatedCallback) {
        this.onJoinCreated = onJoinCreatedCallback;
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
                    
                    if (sourceTable !== targetTable && self.onJoinCreated) {
                        self.onJoinCreated(sourceTable, targetTable);
                    }
                }
            });
        });
    },

    // Cập nhật draggable sau khi thay đổi table cards
    updateDraggable: function() {
        // Hủy draggable/droppable cũ
        $('.table-card').draggable('destroy').droppable('destroy');
        
        // Tạo lại
        this.makeDraggable();
    }
};