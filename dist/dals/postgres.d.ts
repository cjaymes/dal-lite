export default PgDAL;
declare class PgDAL {
    constructor(db_uri: any);
    uri: any;
    get_type(): string;
    connect(): Promise<this>;
    connection: any;
    finalize(): Promise<void>;
}
//# sourceMappingURL=postgres.d.ts.map