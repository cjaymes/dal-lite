"use strict";

import { readFile } from "fs/promises";

export default class Dal {
    constructor(uri) {
        // TODO cache multiple connections
        // singleton
        // if (Dal.instance) {
        //     return Dal.instance;
        // }
        // Dal.instance = this;

        this.uri = uri;
    }

    async connect() {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async tableExists(tableName) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async createTable(tableName, tableDef) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async alterTable(tableName, tableDef) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async exec(sql) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async updateSchema(schemaPath) {
        if (!(await this.tableExists("config"))) {
            console.info(
                `No config table, creating schema from ${schemaPath}/initial.json...`
            );
            let json;
            try {
                json = JSON.parse(
                    await readFile(
                        new URL(`${schemaPath}/initial.json`, import.meta.url)
                    )
                );
            } catch {
                console.error(
                    `Unable to load schema file from ${schemaPath}/initial.json`
                );
                process.exit(1);
            }
            // TODO schemae
            if ("tables" in json) {
                for (let tableName in json.tables) {
                    if (!(await this.tableExists(tableName))) {
                        await this.createTable(
                            tableName,
                            json.tables[tableName]
                        );
                    } else {
                        // TODO CREATE IF NOT EXITS?
                        await this.alterTable(
                            tableName,
                            json.tables[tableName]
                        );
                    }
                }
            }
            if ("indexes" in json) {
                console.log("TODO schema indexes");
            }
            if ("views" in json) {
                console.log("TODO schema views");
            }
        } else {
            console.info("Have config, but might need upgrade.");
            // TODO check config schema.version == package.json version
        }
    }

    async close() {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    static async getDal(uri) {
        if (uri.startsWith("sqlite:") || uri.startsWith("sqlite3:")) {
            return import("./dals/sqlite3.js").then((module) => {
                return new module.default(uri);
            });
        } else if (uri.startsWith("postgres:")) {
            return import("./dals/postgres.js").then((module) => {
                return new module.default(uri);
            });
        } else {
            throw new Error(
                `Unknown database connection type in connection string: ${uri}`
            );
        }
        // TODO auto-connect?
        // TODO auto-update schema?
    }
}
