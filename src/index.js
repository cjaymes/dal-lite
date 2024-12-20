"use strict";

import { readFile } from "fs/promises";

export default class Dal {
    /**
     * @constructor
     * @param {string} uri  - Connection string used to attach to the database
     */
    constructor(uri) {
        // TODO cache multiple connections
        // singleton
        // if (Dal.instance) {
        //     return Dal.instance;
        // }
        // Dal.instance = this;

        this.uri = uri;
    }

    /**
     * Connects the specified database. This is only necessary if you specified connect=false in the options to getDal
     */
    async connect() {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Checks if a table exists
     */
    async tableExists(table) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async createTable(tableName, tableDef) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async alterTable(tableName, defChanges) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async dropTable(tableName) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    quoteIdentifier(name) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    quoteValue(value, type) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    // features from SQL
    // TODO createIndex
    // TODO updateIndex
    // TODO dropIndex
    // TODO createView
    // TODO dropView
    // TODO transaction
    // TODO prepare
    // TODO vacuum
    // TODO explain
    // TODO analyze

    async exec(sql) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async query(sql) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async insert(into, values) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async update(tableName, changes, _options = null) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async select(columns, from, _options = null) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async delete(from, _options = null) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async applyDataDefinition(def) {
        if ("tables" in def) {
            for (let tableName in def.tables) {
                // TODO CREATE IF NOT EXITS?
                await this.createTable(tableName, def.tables[tableName]);
            }
        }
        if ("indexes" in def) {
            throw new Error("TODO def indexes");
        }
        if ("views" in def) {
            throw new Error("TODO def views");
        }
    }

    async close() {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    static async getDal(uri, _options = null) {
        let dal;
        if (uri.startsWith("sqlite:") || uri.startsWith("sqlite3:")) {
            dal = await import("./dals/sqlite3.js").then((module) => {
                return new module.default(uri);
            });
        } else if (uri.startsWith("postgres:")) {
            dal = await import("./dals/postgres.js").then((module) => {
                return new module.default(uri);
            });
        } else {
            throw new Error(
                `Unknown database connection type in connection string: ${uri}`
            );
        }

        if (_options && "connect" in _options && !_options.connect) {
            console.info("Not auto-connecting new DAL");
            return dal;
        } else {
            return dal.connect();
        }
        // TODO auto-update schema?
    }
}
