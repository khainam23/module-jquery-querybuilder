<?php
/**
 * PHP Query Builder Parser Test - Rút gọn
 */

class QueryBuilderParser {
    private $operators = [
        'equal'=>'=', 'not_equal'=>'!=', 'in'=>'IN', 'not_in'=>'NOT IN',
        'less'=>'<','less_or_equal'=>'<=','greater'=>'>','greater_or_equal'=>'>=',
        'between'=>'BETWEEN','not_between'=>'NOT BETWEEN',
        'begins_with'=>'LIKE','not_begins_with'=>'NOT LIKE',
        'contains'=>'LIKE','not_contains'=>'NOT LIKE',
        'ends_with'=>'LIKE','not_ends_with'=>'NOT LIKE',
        'is_empty'=>'IS NULL','is_not_empty'=>'IS NOT NULL',
        'is_null'=>'IS NULL','is_not_null'=>'IS NOT NULL'
    ];

    // Bản đồ quan hệ giữa các bảng (tương tự như trong join-manager.js)
    private $relationshipMap = [
        'users-orders' => [
            'leftTable' => 'users',
            'rightTable' => 'orders',
            'leftField' => 'id',
            'rightField' => 'user_id',
            'joinType' => 'LEFT JOIN'
        ],
        'orders-products' => [
            'leftTable' => 'orders',
            'rightTable' => 'products',
            'leftField' => 'id',
            'rightField' => 'id',
            'joinType' => 'INNER JOIN',
            'throughTable' => 'order_items',
            'throughFields' => ['order_id', 'product_id']
        ],
        'products-categories' => [
            'leftTable' => 'products',
            'rightTable' => 'categories',
            'leftField' => 'category_id',
            'rightField' => 'id',
            'joinType' => 'INNER JOIN'
        ],
        'products-reviews' => [
            'leftTable' => 'products',
            'rightTable' => 'reviews',
            'leftField' => 'id',
            'rightField' => 'product_id',
            'joinType' => 'LEFT JOIN'
        ],
        'users-reviews' => [
            'leftTable' => 'users',
            'rightTable' => 'reviews',
            'leftField' => 'id',
            'rightField' => 'user_id',
            'joinType' => 'LEFT JOIN'
        ]
    ];

    public function parseQuery($query, $table='users') {
        if (is_string($query)) $query = json_decode($query,true);
        if (!$query || !isset($query['rules'])) return '';
        
        // Phát hiện các bảng được sử dụng trong query
        $tablesUsed = $this->detectTablesInQuery($query);
        
        // Tạo FROM clause với JOIN nếu cần
        $fromClause = $this->buildFromClause($table, $tablesUsed);
        
        return "SELECT * FROM {$fromClause} WHERE ".$this->parseRules($query);
    }

    // Phát hiện các bảng được sử dụng trong query
    private function detectTablesInQuery($query) {
        $tables = [];
        $this->extractTablesFromRules($query, $tables);
        return array_unique($tables);
    }

    // Trích xuất tên bảng từ các rules (đệ quy)
    private function extractTablesFromRules($group, &$tables) {
        if (!isset($group['rules']) || !is_array($group['rules'])) return;
        
        foreach ($group['rules'] as $rule) {
            if (isset($rule['rules'])) {
                // Đây là một group con, đệ quy
                $this->extractTablesFromRules($rule, $tables);
            } elseif (isset($rule['field'])) {
                // Đây là một rule, trích xuất tên bảng từ field
                $field = $rule['field'];
                if (strpos($field, '.') !== false) {
                    $tableName = explode('.', $field)[0];
                    $tables[] = $tableName;
                }
            }
        }
    }

    // Tạo FROM clause với JOIN
    private function buildFromClause($mainTable, $tablesUsed) {
        if (empty($tablesUsed) || (count($tablesUsed) == 1 && $tablesUsed[0] == $mainTable)) {
            return "`{$mainTable}`";
        }

        $fromClause = "`{$mainTable}`";
        $joinedTables = [$mainTable];
        
        // Tạo JOIN cho từng bảng
        foreach ($tablesUsed as $table) {
            if ($table != $mainTable && !in_array($table, $joinedTables)) {
                $joinClause = $this->findJoinClause($mainTable, $table, $joinedTables);
                if ($joinClause) {
                    $fromClause .= " " . $joinClause;
                    $joinedTables[] = $table;
                }
            }
        }
        
        return $fromClause;
    }

    // Tìm JOIN clause phù hợp giữa hai bảng
    private function findJoinClause($fromTable, $toTable, $joinedTables) {
        // Thử tìm quan hệ trực tiếp
        $relationship = $this->findRelationship($fromTable, $toTable);
        if ($relationship) {
            return $this->buildJoinClause($relationship);
        }
        
        // Thử tìm quan hệ gián tiếp qua các bảng đã JOIN
        foreach ($joinedTables as $intermediateTable) {
            if ($intermediateTable != $fromTable) {
                $relationship = $this->findRelationship($intermediateTable, $toTable);
                if ($relationship) {
                    return $this->buildJoinClause($relationship);
                }
            }
        }
        
        return null;
    }

    // Tìm quan hệ giữa hai bảng
    private function findRelationship($table1, $table2) {
        $key1 = $table1 . '-' . $table2;
        $key2 = $table2 . '-' . $table1;
        
        if (isset($this->relationshipMap[$key1])) {
            return $this->relationshipMap[$key1];
        } elseif (isset($this->relationshipMap[$key2])) {
            // Đảo ngược quan hệ
            $rel = $this->relationshipMap[$key2];
            return [
                'leftTable' => $rel['rightTable'],
                'rightTable' => $rel['leftTable'],
                'leftField' => $rel['rightField'],
                'rightField' => $rel['leftField'],
                'joinType' => $rel['joinType']
            ];
        }
        
        return null;
    }

    // Tạo JOIN clause từ relationship
    private function buildJoinClause($relationship) {
        if (isset($relationship['throughTable'])) {
            // Many-to-many relationship với bảng trung gian
            $throughTable = $relationship['throughTable'];
            $throughFields = $relationship['throughFields'];
            
            return "{$relationship['joinType']} `{$throughTable}` ON `{$relationship['leftTable']}`.`{$relationship['leftField']}` = `{$throughTable}`.`{$throughFields[0]}` " .
                   "{$relationship['joinType']} `{$relationship['rightTable']}` ON `{$throughTable}`.`{$throughFields[1]}` = `{$relationship['rightTable']}`.`{$relationship['rightField']}`";
        } else {
            // Quan hệ trực tiếp
            return "{$relationship['joinType']} `{$relationship['rightTable']}` ON `{$relationship['leftTable']}`.`{$relationship['leftField']}` = `{$relationship['rightTable']}`.`{$relationship['rightField']}`";
        }
    }

    private function parseRules($group) {
        if (empty($group['rules'])) return '1=1';
        $condition = strtoupper(isset($group['condition']) ? $group['condition'] : 'AND');
        $parts=array();
        foreach ($group['rules'] as $rule) {
            $parts[] = isset($rule['rules']) ? "({$this->parseRules($rule)})" : $this->parseRule($rule);
        }
        return implode(" {$condition} ",$parts);
    }

    private function parseRule($r) {
        $f=$r['field']; 
        $op=$r['operator']; 
        $v=isset($r['value']) ? $r['value'] : null; 
        $t=isset($r['type']) ? $r['type'] : 'string';
        $sqlOp=isset($this->operators[$op]) ? $this->operators[$op] : '=';
        $val=$this->formatValue($v,$t,$op);

        switch($op) {
            case 'is_empty':
            case 'is_null':
                return "`$f` IS NULL";
            case 'is_not_empty':
            case 'is_not_null':
                return "`$f` IS NOT NULL";
            case 'in':
            case 'not_in':
                return "`$f` $sqlOp (".implode(', ',array_map(array($this,'escapeValue'),(array)$v)).")";
            case 'between':
            case 'not_between':
                return count((array)$v)>=2 ? "`$f` $sqlOp ".$this->escapeValue($v[0])." AND ".$this->escapeValue($v[1]) : '';
            case 'begins_with':
                return "`$f` LIKE '{$v}%'";
            case 'ends_with':
                return "`$f` LIKE '%{$v}'";
            case 'contains':
                return "`$f` LIKE '%{$v}%'";
            case 'not_begins_with':
                return "`$f` NOT LIKE '{$v}%'";
            case 'not_ends_with':
                return "`$f` NOT LIKE '%{$v}'";
            case 'not_contains':
                return "`$f` NOT LIKE '%{$v}%'";
            default:
                return "`$f` $sqlOp $val";
        }
    }

    private function formatValue($v,$t,$op) {
        if ($v===null) return 'NULL';
        switch($t) {
            case 'integer':
                return (int)$v;
            case 'double':
                return (float)$v;
            case 'boolean':
                return $v ? '1' : '0';
            case 'datetime':
                return "'".$this->escapeString($v)."'";
            default:
                return "'".$this->escapeString($v)."'";
        }
    }

    private function escapeValue($v) { return is_numeric($v)?$v:"'".$this->escapeString($v)."'"; }
    private function escapeString($s){ return str_replace("'","''",$s); }

    public function validateQuery($q){
        if (is_string($q)) $q=json_decode($q,true);
        if(!$q) return ['valid'=>false,'error'=>'Invalid JSON'];
        if(!isset($q['rules'])) return ['valid'=>false,'error'=>'Missing rules'];
        return ['valid'=>true,'error'=>null];
    }
}

function testQueryParser($save=false) {
    $out="<h2>QueryBuilder Parser Test</h2><hr>\n";
    $file=__DIR__.'/query/test1.json';
    if(!file_exists($file)) return "<p class='error'>File $file không tồn tại!</p>";

    $json=file_get_contents($file);
    $q=json_decode($json,true);
    if(!$q) return "<p class='error'>Không thể parse JSON!</p>";

    $parser=new QueryBuilderParser();
    $val=$parser->validateQuery($q);
    $out.="<h3>Validation:</h3><p class='".($val['valid']?'success':'error')."'>".($val['valid']?"✓ Hợp lệ":"✗ Lỗi: ".$val['error'])."</p>";
    
    $sql=$parser->parseQuery($q);
    $formatted=str_replace([' AND ',' OR '],["\n  AND ","\n  OR "],str_replace('WHERE ',"WHERE\n  ",$sql));
    $out.="<h3>SQL:</h3><pre>$sql</pre><h3>Formatted:</h3><pre>$formatted</pre>";

    if($save) return $out; else echo $out;
}

function saveTestResultToHtml(){
    $content=testQueryParser(true);
    $html="<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Test Result</title></head><body>
    <div>Generated on: ".date('Y-m-d H:i:s')."</div>$content</body></html>";
    $file=__DIR__.'/test_results_'.date('Y-m-d_H-i-s').'.html';
    return file_put_contents($file,$html)?$file:false;
}

// Auto run nếu gọi trực tiếp qua web
if(php_sapi_name()!=='cli'){
    testQueryParser();
    if($f=saveTestResultToHtml()) echo "<p>✓ Đã lưu: <a href='".basename($f)."' target='_blank'>".basename($f)."</a></p>";
} else {
    echo "Running...\n"; testQueryParser(); echo "Saved: ".(saveTestResultToHtml()?:'Error')."\n";
}
