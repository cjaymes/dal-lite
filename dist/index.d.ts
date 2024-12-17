export default class Dal {
    static getDal(uri: any): Promise<import("./dals/sqlite3.js").default | import("./dals/postgres.js").default>;
    constructor(uri: any);
    uri: any;
    connect(): Promise<void>;
    tableExists(tableName: any): Promise<void>;
    createTable(tableName: any, tableDef: any): Promise<void>;
    alterTable(tableName: any, tableDef: any): Promise<void>;
    exec(sql: any): Promise<void>;
    updateSchema(schemaPath: any): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map