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

    async dropTable(tableName) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
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
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async query(sql) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async insert(values, into) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async update(tableName, changes, _where) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async select(from, _where, _groupBy) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async delete(from, _where, _orderBy, _limit) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    async applyDataDefinition(def) {
        if ("tables" in def) {
            for (let tableName in def.tables) {
                // TODO CREATE IF NOT EXITS?
                await this.createTable(
                    tableName,
                    def.tables[tableName]
                );
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
