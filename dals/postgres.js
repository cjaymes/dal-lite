import pgp from 'pg-promise';

class PgDAL {
    constructor(db_uri) {
        // singleton
        if (PgDAL.instance) {
            return PgDAL.instance;
        }
        PgDAL.instance = this;

        this.uri = db_uri
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

export default PgDAL
