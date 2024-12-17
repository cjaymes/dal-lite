import pgp from 'pg-promise';
import Dal from "../index.js";

class PgDal extends Dal {
    constructor(uri) {
        super(uri);
    }

    get_type() {
        return 'postgres'
    }

    async connect() {
        // TODO parse some useful information out of the URI
        console.info(`Connecting to postgres database...`)
        this.connection = await pgp(this.db_uri).connect()

        return this
    }

    async finalize() {
        console.info(`Disconnecting from postgres database...`)
        await this.connection.done(true)
    }
}

export default PgDal
