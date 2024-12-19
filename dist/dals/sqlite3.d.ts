export default class SqliteDal extends Dal {
    constructor(uri: any);
    _columnTypeCache: {};
    get type(): string;
    connect(): Promise<any>;
    connection: any;
    tableExists(tableName: any): Promise<any>;
    _getColumnDdl(columnName: any, columnDef: any): string;
    _getPrimaryKeyDdl(primaryKeyDef: any): string;
    _getForeignKeyDdl(foreignKeyDef: any): string;
    _getTableSpec(table: any): string;
    _getTableDdl(table: any, tableDef: any): string;
    createTable(table: any, tableDef: any): Promise<any>;
    dropTable(table: any): Promise<any>;
    exec(sql: any): Promise<any>;
    query(sql: any): Promise<any>;
    quoteIdentifier(name: any): string;
    quoteValue(value: any, type: any): any;
    _getTableCacheKey(table: any): string;
    _getColumnTypes(table: any): Promise<any>;
    insert(table: any, values: any): Promise<any>;
    update(table: any, changes: any, _options?: any): Promise<any>;
    _getFromClause(from: any): string;
    _getWhereClause(options: any, colTypes: any): string;
    _getGroupByClause(options: any, colTypes: any): string;
    _getOrderByClause(options: any, colTypes: any): string;
    _getLimitClause(options: any, colTypes: any): string;
    select(columns: any, from: any, _options?: any): Promise<any>;
    delete(table: any, _options?: any): Promise<any>;
    close(): Promise<any>;
    finalize(): Promise<void>;
}
import Dal from "../index.js";
//# sourceMappingURL=sqlite3.d.ts.map