import pg from 'pg'
const { Client } = pg;
import Dal from "../index.js";

class PgDal extends Dal {
    constructor(uri) {
        super(uri);
    }

    get type() {
        return 'postgres'
    }

    async connect() {
        // TODO parse some useful information out of the URI
        console.info(`Connecting to postgres database...`)
        this.connection = new Client({connectionString: this.uri});
        await this.connection.connect()

        return this
    }

    // TODO query

    async finalize() {
        console.info(`Disconnecting from postgres database...`)
        await this.connection.end()
    }
}

export default PgDal
