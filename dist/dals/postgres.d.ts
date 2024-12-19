export default PgDal;
declare class PgDal extends Dal {
    constructor(uri: any);
    get type(): string;
    connect(): Promise<this>;
    connection: any;
    finalize(): Promise<void>;
}
import Dal from "../index.js";
//# sourceMappingURL=postgres.d.ts.map