// Helper cho tutorial và hướng dẫn
var TutorialHelper = {
    isFirstTime: true,
    currentStep: 0,
    
    // Khởi tạo tutorial
    init: function() {
        this.checkFirstTime();
        this.createHelpButton();
        this.bindEvents();
    },
    
    // Kiểm tra lần đầu sử dụng
    checkFirstTime: function() {
        var hasVisited = localStorage.getItem('joinTutorialCompleted');
        if (!hasVisited) {
            this.showWelcomeTutorial();
        }
    },
    
    // Tạo nút help
    createHelpButton: function() {
        var helpButton = `
            <div id="help-button" class="fixed bottom-4 right-4 z-40">
                <button class="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                    <i class="fas fa-question text-lg"></i>
                </button>
            </div>
        `;
        $('body').append(helpButton);
    },
    
    // Hiển thị tutorial chào mừng
    showWelcomeTutorial: function() {
        var self = this;
        var tutorialSteps = [
            {
                target: '#join-manager',
                title: 'Chào mừng đến với tính năng JOIN!',
                content: 'Tính năng này giúp bạn kết hợp dữ liệu từ nhiều bảng một cách dễ dàng. Hãy cùng tìm hiểu cách sử dụng!',
                position: 'bottom'
            },
            {
                target: '#table-cards',
                title: 'Các bảng dữ liệu',
                content: 'Đây là các bảng dữ liệu có sẵn. Bảng có viền xanh là bảng chính đang được chọn.',
                position: 'top'
            },
            {
                target: '#table-cards .table-card:first',
                title: 'Kéo thả để kết nối',
                content: 'Kéo một bảng và thả lên bảng khác để tạo kết nối. Hệ thống sẽ tự động tìm quan hệ phù hợp.',
                position: 'right'
            },
            {
                target: '#suggestions-list',
                title: 'Gợi ý kết nối',
                content: 'Hệ thống gợi ý các kết nối có thể có dựa trên cấu trúc dữ liệu. Nhấn "Thêm" để sử dụng gợi ý.',
                position: 'top'
            },
            {
                target: '#joins-list',
                title: 'Danh sách kết nối',
                content: 'Các kết nối đã tạo sẽ hiển thị ở đây. Bạn có thể xóa kết nối bằng cách nhấn nút X.',
                position: 'top'
            },
            {
                target: '#subquery-manager',
                title: 'Truy vấn con (SubQuery)',
                content: 'Tính năng mạnh mẽ để tạo điều kiện phức tạp bằng cách sử dụng kết quả từ truy vấn khác. Rất hữu ích cho các truy vấn nâng cao!',
                position: 'bottom'
            },
            {
                target: '#subquery-type-cards',
                title: 'Các loại truy vấn con',
                content: 'Chọn loại truy vấn con phù hợp: IN/NOT IN để kiểm tra danh sách, EXISTS để kiểm tra tồn tại, hoặc Scalar để lấy giá trị tính toán.',
                position: 'top'
            },
            {
                target: '#subquery-suggestions-list',
                title: 'Gợi ý truy vấn con',
                content: 'Hệ thống gợi ý các truy vấn con phổ biến dựa trên bảng hiện tại. Nhấn "Thêm" để sử dụng gợi ý nhanh chóng.',
                position: 'top'
            }
        ];
        
        this.showTutorialStep(tutorialSteps, 0);
    },
    
    // Hiển thị tutorial riêng cho SubQuery
    showSubQueryTutorial: function() {
        var self = this;
        var subQuerySteps = [
            {
                target: '#subquery-manager',
                title: 'Truy vấn con là gì?',
                content: 'Truy vấn con (SubQuery) là truy vấn SQL được lồng bên trong truy vấn chính. Nó giúp tạo điều kiện phức tạp và linh hoạt hơn.',
                position: 'bottom'
            },
            {
                target: '#subquery-type-cards .subquery-type-card[data-type="where_in"]',
                title: 'IN/NOT IN SubQuery',
                content: 'Kiểm tra xem giá trị có nằm trong danh sách kết quả của truy vấn con hay không. Ví dụ: tìm người dùng có đơn hàng.',
                position: 'right'
            },
            {
                target: '#subquery-type-cards .subquery-type-card[data-type="where_exists"]',
                title: 'EXISTS SubQuery',
                content: 'Kiểm tra sự tồn tại của dữ liệu thỏa mãn điều kiện. Hiệu quả hơn IN khi chỉ cần kiểm tra tồn tại.',
                position: 'right'
            },
            {
                target: '#subquery-type-cards .subquery-type-card[data-type="select_scalar"]',
                title: 'Scalar SubQuery',
                content: 'Trả về một giá trị duy nhất từ hàm tính toán (COUNT, SUM, AVG, MAX, MIN). Ví dụ: đếm số đơn hàng của mỗi khách hàng.',
                position: 'right'
            },
            {
                target: '#subquery-suggestions-list',
                title: 'Sử dụng gợi ý',
                content: 'Hệ thống tự động tạo gợi ý dựa trên bảng hiện tại và mối quan hệ dữ liệu. Nhấn "Thêm" để áp dụng nhanh.',
                position: 'top'
            },
            {
                target: '#subqueries-list',
                title: 'Quản lý truy vấn con',
                content: 'Các truy vấn con đã tạo sẽ hiển thị ở đây. Bạn có thể chỉnh sửa hoặc xóa từng truy vấn con.',
                position: 'top'
            }
        ];
        
        this.showTutorialStep(subQuerySteps, 0);
    },
    
    // Hiển thị tooltip hướng dẫn cho SubQuery type cụ thể
    showSubQueryTypeHelp: function(subQueryType) {
        var typeInfo = {
            'where_in': {
                title: 'IN SubQuery',
                content: 'Tìm các bản ghi có giá trị nằm trong danh sách kết quả của truy vấn con.',
                example: 'Ví dụ: Tìm người dùng có đơn hàng<br><code>user_id IN (SELECT user_id FROM orders)</code>',
                useCases: ['Tìm khách hàng có đơn hàng', 'Tìm sản phẩm được đánh giá', 'Tìm danh mục có sản phẩm']
            },
            'where_not_in': {
                title: 'NOT IN SubQuery',
                content: 'Tìm các bản ghi có giá trị không nằm trong danh sách kết quả của truy vấn con.',
                example: 'Ví dụ: Tìm người dùng chưa có đơn hàng<br><code>user_id NOT IN (SELECT user_id FROM orders)</code>',
                useCases: ['Tìm khách hàng chưa mua hàng', 'Tìm sản phẩm chưa được đánh giá', 'Tìm danh mục trống']
            },
            'where_exists': {
                title: 'EXISTS SubQuery',
                content: 'Kiểm tra sự tồn tại của dữ liệu thỏa mãn điều kiện. Hiệu quả hơn IN khi chỉ cần kiểm tra tồn tại.',
                example: 'Ví dụ: Tìm người dùng có đơn hàng<br><code>EXISTS (SELECT 1 FROM orders WHERE user_id = users.id)</code>',
                useCases: ['Kiểm tra tồn tại quan hệ', 'Tìm bản ghi có liên kết', 'Lọc theo điều kiện phức tạp']
            },
            'where_not_exists': {
                title: 'NOT EXISTS SubQuery',
                content: 'Kiểm tra không tồn tại dữ liệu thỏa mãn điều kiện.',
                example: 'Ví dụ: Tìm người dùng chưa có đơn hàng<br><code>NOT EXISTS (SELECT 1 FROM orders WHERE user_id = users.id)</code>',
                useCases: ['Tìm bản ghi không có liên kết', 'Kiểm tra thiếu dữ liệu', 'Lọc bản ghi độc lập']
            },
            'select_scalar': {
                title: 'Scalar SubQuery',
                content: 'Trả về một giá trị duy nhất từ hàm tính toán. Thường dùng trong SELECT hoặc WHERE.',
                example: 'Ví dụ: Đếm số đơn hàng<br><code>(SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count</code>',
                useCases: ['Đếm số lượng liên quan', 'Tính tổng/trung bình', 'Lấy giá trị max/min']
            }
        };
        
        var info = typeInfo[subQueryType];
        if (!info) return;
        
        var helpHtml = `
            <div id="subquery-type-help" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-purple-600">${info.title}</h3>
                        <button id="close-subquery-help" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <h4 class="font-medium text-gray-900 mb-2">Mô tả:</h4>
                            <p class="text-sm text-gray-600">${info.content}</p>
                        </div>
                        
                        <div>
                            <h4 class="font-medium text-gray-900 mb-2">Ví dụ:</h4>
                            <div class="bg-gray-50 p-3 rounded text-sm">${info.example}</div>
                        </div>
                        
                        <div>
                            <h4 class="font-medium text-gray-900 mb-2">Trường hợp sử dụng:</h4>
                            <ul class="text-sm text-gray-600 space-y-1">
                                ${info.useCases.map(useCase => `<li>• ${useCase}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="flex gap-2 mt-6">
                        <button id="try-subquery-type" class="bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600" data-type="${subQueryType}">
                            <i class="fas fa-play mr-1"></i>Thử ngay
                        </button>
                        <button id="close-subquery-help-btn" class="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400">
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(helpHtml);
        
        $('#close-subquery-help, #close-subquery-help-btn').on('click', function() {
            $('#subquery-type-help').remove();
        });
        
        $('#try-subquery-type').on('click', function() {
            var type = $(this).data('type');
            $('#subquery-type-help').remove();
            // Trigger the subquery type selection
            $(`.subquery-type-card[data-type="${type}"]`).trigger('click');
        });
    },
    
    // Hiển thị từng bước tutorial
    showTutorialStep: function(steps, stepIndex) {
        var self = this;
        
        if (stepIndex >= steps.length) {
            this.completeTutorial();
            return;
        }
        
        var step = steps[stepIndex];
        var $target = $(step.target);
        
        if ($target.length === 0) {
            // Nếu target không tồn tại, chuyển sang bước tiếp theo
            this.showTutorialStep(steps, stepIndex + 1);
            return;
        }
        
        // Tạo overlay
        this.createOverlay();
        
        // Highlight target
        this.highlightElement($target);
        
        // Tạo tooltip
        this.createTooltip(step, function() {
            self.showTutorialStep(steps, stepIndex + 1);
        }, function() {
            self.skipTutorial();
        });
    },
    
    // Tạo overlay
    createOverlay: function() {
        if ($('#tutorial-overlay').length === 0) {
            $('body').append('<div id="tutorial-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-50"></div>');
        }
    },
    
    // Highlight element
    highlightElement: function($element) {
        $('.tutorial-highlight').removeClass('tutorial-highlight');
        $element.addClass('tutorial-highlight');
        
        // Scroll to element
        $('html, body').animate({
            scrollTop: $element.offset().top - 100
        }, 500);
    },
    
    // Tạo tooltip
    createTooltip: function(step, nextCallback, skipCallback) {
        $('#tutorial-tooltip').remove();
        
        var tooltip = `
            <div id="tutorial-tooltip" class="fixed bg-white rounded-lg shadow-xl p-4 max-w-sm z-50">
                <h3 class="font-semibold text-gray-900 mb-2">${step.title}</h3>
                <p class="text-gray-600 text-sm mb-4">${step.content}</p>
                <div class="flex gap-2">
                    <button id="tutorial-next" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                        Tiếp theo
                    </button>
                    <button id="tutorial-skip" class="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400">
                        Bỏ qua
                    </button>
                </div>
            </div>
        `;
        
        $('body').append(tooltip);
        
        // Position tooltip
        this.positionTooltip(step.target, step.position);
        
        // Bind events
        $('#tutorial-next').on('click', nextCallback);
        $('#tutorial-skip').on('click', skipCallback);
    },
    
    // Position tooltip
    positionTooltip: function(target, position) {
        var $target = $(target);
        var $tooltip = $('#tutorial-tooltip');
        var targetOffset = $target.offset();
        var targetWidth = $target.outerWidth();
        var targetHeight = $target.outerHeight();
        var tooltipWidth = $tooltip.outerWidth();
        var tooltipHeight = $tooltip.outerHeight();
        
        var left, top;
        
        switch (position) {
            case 'top':
                left = targetOffset.left + (targetWidth / 2) - (tooltipWidth / 2);
                top = targetOffset.top - tooltipHeight - 10;
                break;
            case 'bottom':
                left = targetOffset.left + (targetWidth / 2) - (tooltipWidth / 2);
                top = targetOffset.top + targetHeight + 10;
                break;
            case 'left':
                left = targetOffset.left - tooltipWidth - 10;
                top = targetOffset.top + (targetHeight / 2) - (tooltipHeight / 2);
                break;
            case 'right':
                left = targetOffset.left + targetWidth + 10;
                top = targetOffset.top + (targetHeight / 2) - (tooltipHeight / 2);
                break;
            default:
                left = targetOffset.left;
                top = targetOffset.top + targetHeight + 10;
        }
        
        // Ensure tooltip stays within viewport
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        
        if (left < 10) left = 10;
        if (left + tooltipWidth > windowWidth - 10) left = windowWidth - tooltipWidth - 10;
        if (top < 10) top = 10;
        if (top + tooltipHeight > windowHeight - 10) top = windowHeight - tooltipHeight - 10;
        
        $tooltip.css({
            left: left + 'px',
            top: top + 'px'
        });
    },
    
    // Hoàn thành tutorial
    completeTutorial: function() {
        this.cleanupTutorial();
        localStorage.setItem('joinTutorialCompleted', 'true');
        this.showCompletionMessage();
    },
    
    // Bỏ qua tutorial
    skipTutorial: function() {
        this.cleanupTutorial();
        localStorage.setItem('joinTutorialCompleted', 'true');
    },
    
    // Dọn dẹp tutorial
    cleanupTutorial: function() {
        $('#tutorial-overlay').remove();
        $('#tutorial-tooltip').remove();
        $('.tutorial-highlight').removeClass('tutorial-highlight');
    },
    
    // Hiển thị thông báo hoàn thành
    showCompletionMessage: function() {
        var message = `
            <div class="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50">
                <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    <div>
                        <div class="font-semibold">Hoàn thành hướng dẫn!</div>
                        <div class="text-sm">Bạn đã sẵn sàng sử dụng tính năng JOIN</div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(message);
        
        setTimeout(function() {
            $('.bg-green-500').fadeOut(function() {
                $(this).remove();
            });
        }, 4000);
    },
    
    // Hiển thị help dialog
    showHelpDialog: function() {
        var helpContent = `
            <div id="help-dialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">Hướng dẫn sử dụng JOIN</h3>
                        <button id="close-help" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <h4 class="font-medium text-gray-900 mb-2">
                                <i class="fas fa-info-circle text-blue-500 mr-2"></i>JOIN là gì?
                            </h4>
                            <p class="text-sm text-gray-600">${uiMessages.tutorials.joinBasics}</p>
                        </div>
                        
                        <div>
                            <h4 class="font-medium text-gray-900 mb-2">
                                <i class="fas fa-mouse-pointer text-green-500 mr-2"></i>Cách kéo thả
                            </h4>
                            <p class="text-sm text-gray-600">${uiMessages.tutorials.dragDrop}</p>
                        </div>
                        
                        <div>
                            <h4 class="font-medium text-gray-900 mb-2">
                                <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>Gợi ý tự động
                            </h4>
                            <p class="text-sm text-gray-600">${uiMessages.tutorials.suggestions}</p>
                        </div>
                        
                        <div>
                            <h4 class="font-medium text-gray-900 mb-2">
                                <i class="fas fa-cog text-gray-500 mr-2"></i>Kết nối thủ công
                            </h4>
                            <p class="text-sm text-gray-600">${uiMessages.tutorials.manualJoin}</p>
                        </div>
                        
                        <div>
                            <h4 class="font-medium text-gray-900 mb-2">Các loại JOIN:</h4>
                            <div class="space-y-2 text-sm">
                                <div><strong>INNER JOIN:</strong> ${uiMessages.joinExplanation['INNER JOIN']}</div>
                                <div><strong>LEFT JOIN:</strong> ${uiMessages.joinExplanation['LEFT JOIN']}</div>
                                <div><strong>RIGHT JOIN:</strong> ${uiMessages.joinExplanation['RIGHT JOIN']}</div>
                            </div>
                        </div>
                        
                        <div class="border-t pt-4">
                            <h4 class="font-medium text-gray-900 mb-2">
                                <i class="fas fa-layer-group text-purple-500 mr-2"></i>Truy vấn con (SubQuery)
                            </h4>
                            <p class="text-sm text-gray-600 mb-3">Truy vấn con giúp tạo điều kiện phức tạp bằng cách sử dụng kết quả từ truy vấn khác.</p>
                            
                            <div class="space-y-2 text-sm">
                                <div><strong>IN/NOT IN:</strong> Kiểm tra giá trị có trong danh sách kết quả hay không</div>
                                <div><strong>EXISTS/NOT EXISTS:</strong> Kiểm tra sự tồn tại của dữ liệu thỏa mãn điều kiện</div>
                                <div><strong>Scalar SubQuery:</strong> Lấy một giá trị từ hàm tính toán (COUNT, SUM, AVG, MAX, MIN)</div>
                            </div>
                            
                            <div class="mt-3 p-2 bg-purple-50 rounded text-xs">
                                <strong>Ví dụ:</strong> Tìm người dùng có đơn hàng: <code>user_id IN (SELECT user_id FROM orders)</code>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap gap-2 mt-6">
                        <button id="restart-tutorial" class="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">
                            <i class="fas fa-play mr-1"></i>Hướng dẫn tổng quan
                        </button>
                        <button id="subquery-tutorial" class="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600">
                            <i class="fas fa-layer-group mr-1"></i>Hướng dẫn SubQuery
                        </button>
                        <button id="close-help-btn" class="bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-400">
                            <i class="fas fa-times mr-1"></i>Đóng
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(helpContent);
        
        var self = this;
        $('#close-help, #close-help-btn').on('click', function() {
            $('#help-dialog').remove();
        });
        
        $('#restart-tutorial').on('click', function() {
            $('#help-dialog').remove();
            localStorage.removeItem('joinTutorialCompleted');
            self.showWelcomeTutorial();
        });
        
        $('#subquery-tutorial').on('click', function() {
            $('#help-dialog').remove();
            self.showSubQueryTutorial();
        });
    },
    
    // Bind events
    bindEvents: function() {
        var self = this;
        
        $('#help-button').on('click', function() {
            self.showHelpDialog();
        });
        
        // Keyboard shortcuts
        $(document).on('keydown', function(e) {
            if (e.key === 'F1' || (e.ctrlKey && e.key === 'h')) {
                e.preventDefault();
                self.showHelpDialog();
            }
        });
        
        // SubQuery type card help - Right click for detailed help
        $(document).on('contextmenu', '.subquery-type-card', function(e) {
            e.preventDefault();
            var type = $(this).data('type');
            self.showSubQueryTypeHelp(type);
        });
        
        // SubQuery type card help - Double click for detailed help
        $(document).on('dblclick', '.subquery-type-card', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var type = $(this).data('type');
            self.showSubQueryTypeHelp(type);
        });
        
        // Add help icon to subquery type cards
        $(document).on('mouseenter', '.subquery-type-card', function() {
            if (!$(this).find('.help-icon').length) {
                $(this).addClass('relative');
                $(this).append('<div class="help-icon absolute top-1 right-1 text-xs text-gray-400 hover:text-purple-500" title="Nhấp đúp hoặc chuột phải để xem hướng dẫn chi tiết"><i class="fas fa-question-circle"></i></div>');
            }
        });
        
        $(document).on('mouseleave', '.subquery-type-card', function() {
            $(this).find('.help-icon').remove();
        });
    }
};