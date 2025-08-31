$(document).ready(function () {
    // Khởi tạo TableManager
    TableManager.init();
    
    // Đợi TableManager khởi tạo xong rồi mới khởi tạo các manager khác
    setTimeout(function() {
        // Khởi tạo JoinManager
        JoinManager.init();
        
        // Khởi tạo SubQueryManager
        SubQueryManager.init();
        
        // Khởi tạo Tutorial Helper
        TutorialHelper.init();
    }, 100);

    // Xử lý nút "Tạo Query"
    $('#btn-get').on('click', function () {
        try {
            // Kiểm tra validation trước khi tạo SQL
            var isValid = $('#builder').queryBuilder('validate');
            
            if (isValid) {
                var result = $('#builder').queryBuilder('getSQL');
                var sqlText = (result && result.sql) ? result.sql : uiMessages.noSqlGenerated;
                
                // Thêm JOIN vào SQL nếu có
                if (typeof JoinManager !== 'undefined' && JoinManager.joins.length > 0) {
                    sqlText = JoinManager.generateJoinSQL(sqlText);
                }
                
                // Thêm Sub Query vào SQL nếu có
                if (typeof SubQueryManager !== 'undefined') {
                    sqlText = SubQueryManager.generateSQL(sqlText);
                }
                
                $('#sql-result').text(sqlText);

                var rules = $('#builder').queryBuilder('getRules');
                $('#json-result').text(JSON.stringify(rules, null, 2));
            } else {
                $('#sql-result').text(uiMessages.validationError);
                $('#json-result').text(uiMessages.validationJsonError);
            }
        } catch (error) {
            $('#sql-result').text(uiMessages.errorPrefix + error.message);
            $('#json-result').text(uiMessages.errorPrefix + error.message);
        }
    });

    // Xử lý nút "Reset"
    $('#btn-reset').on('click', function () {
        $('#builder').queryBuilder('reset');
        $('#sql-result').text(uiMessages.sqlPlaceholder);
        $('#json-result').text(uiMessages.jsonPlaceholder);
    });

    // Smooth scrolling cho navigation
    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });

    // Tự động tạo query khi có thay đổi
    $('#builder').on('afterUpdateRuleValue.queryBuilder afterUpdateRuleOperator.queryBuilder afterUpdateGroupCondition.queryBuilder afterAddRule.queryBuilder afterDeleteRule.queryBuilder', function () {
        setTimeout(function () {
            try {
                $('#btn-get').trigger('click');
            } catch (error) {
                console.log('Auto-update error:', error);
            }
        }, 100);
    });

    // Tạo query ban đầu
    setTimeout(function () {
        $('#btn-get').trigger('click');
    }, 500);
});