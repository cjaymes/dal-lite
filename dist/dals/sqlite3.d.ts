export default class SqliteDal extends Dal {
    get_type(): string;
    connect(): Promise<any>;
    connection: any;
    tableExists(tableName: any): Promise<any>;
    _getColumnDdl(columnName: any, columnDef: any): string;
    _getPrimaryKeyDdl(primaryKeyDef: any): string;
    _getForeignKeyDdl(foreignKeyDef: any): string;
    createTable(tableName: any, tableDef: any): Promise<any>;
    exec(sql: any): Promise<any>;
    close(): Promise<any>;
    finalize(): Promise<void>;
}
import Dal from "../index.js";
//# sourceMappingURL=sqlite3.d.ts.map