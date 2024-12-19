export default class Dal {
    static getDal(uri: any, _options?: any): Promise<any>;
    /**
     * @constructor
     * @param {string} uri  - Connection string used to attach to the database
     */
    constructor(uri: string);
    uri: string;
    /**
     * Connects the specified database. This is only necessary if you specified connect=false in the options to getDal
     */
    connect(): Promise<void>;
    tableExists(tableName: any): Promise<void>;
    createTable(tableName: any, tableDef: any): Promise<void>;
    alterTable(tableName: any, defChanges: any): Promise<void>;
    dropTable(tableName: any): Promise<void>;
    quoteIdentifier(name: any): void;
    quoteValue(value: any, type: any): void;
    exec(sql: any): Promise<void>;
    query(sql: any): Promise<void>;
    insert(into: any, values: any): Promise<void>;
    update(tableName: any, changes: any, _options?: any): Promise<void>;
    select(columns: any, from: any, _options?: any): Promise<void>;
    delete(from: any, _options?: any): Promise<void>;
    applyDataDefinition(def: any): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map