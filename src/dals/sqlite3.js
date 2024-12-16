"use strict";

import sqlite3 from "sqlite3";
import Dal from "../index.js";

sqlite3.verbose();

export default class SqliteDal extends Dal {
    constructor(uri) {
        super(uri);
    }

    get_type() {
        return "sqlite3";
    }

    async connect() {
        const filename = this.uri.split(":")[1];
        console.info(`Opening sqlite3 database ${filename}...`);
        this.connection = new sqlite3.Database(filename);

        return this;
    }

    async tableExists(tableName) {
        return new Promise((resolve, reject) => {
            this.connection.get(
                `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`,
                [tableName],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (row === undefined) {
                            console.debug(`${tableName} does not exist`);
                        } else {
                            console.debug(`${tableName} exists`);
                        }
                        resolve(
                            row !== undefined &&
                            Object.hasOwn(row, "name") &&
                            row.name == tableName
                        );
                    }
                }
            );
        });
    }

    _getColumnDdl(columnName, columnDef) {
        if (!Object.hasOwn(columnDef, "type")) {
            throw new Error(`columns require type`);
        }

        let sql = `"${columnName}"`;

        console.debug(`column: ${columnName} ${JSON.stringify(columnDef)}`);

        if (!["NULL", "INTEGER", "REAL", "TEXT", "BLOB"].includes(columnDef.type)) {
            throw new Error(`Unknown column type: ${columnDef.type}`);
        }
        sql += " " + columnDef.type;

        // TODO CONSTRAINT name
        // TODO PRIMARY KEY {ASC|DESC} conflict-clause
        // TODO AUTOINCREMENT

        if ("notNull" in columnDef && columnDef.notNull) {
            sql += " NOT NULL";
        }

        // TODO UNIQUE
        // TODO CHECK ( expr )
        // TODO DEFAULT ( expr )
        // TODO COLLATE collation-name
        // TODO foreign-key-clause
        // TODO GENERATED ALWAYS
        // TODO AS ( expr )
        // TODO STORED
        // TODO VIRTUAL

        return sql;
    }

    _getPrimaryKeyDdl(primaryKeyDef) {
        console.debug(`primaryKey: ${JSON.stringify(primaryKeyDef)}`);

        let sql;
        // TODO CONSTRAINT name
        sql = "PRIMARY KEY ("

        if (!Array.isArray(primaryKeyDef)) {
            throw new Error("primary key definition should be an array");
        }

        sql += primaryKeyDef.map((v) => { return `"${v}"` }).join(", ");

        sql += ")";
        // TODO conflict-clause
        return sql;
    }

    _getForeignKeyDdl(foreignKeyDef) {
        if (!Object.hasOwn(foreignKeyDef, "columns") || !Object.hasOwn(foreignKeyDef, "references") || !Object.hasOwn(foreignKeyDef.references, "table") || !Object.hasOwn(foreignKeyDef.references, "columns")) {
            throw new Error("foreign key definition requires columns & references & references.table & references.columns");
        }
        console.debug(
            `foreignKey: ${JSON.stringify(foreignKeyDef)}`
        );

        let sql;

        sql = `FOREIGN KEY (${foreignKeyDef.columns.map((v) => { return `"${v}"` }).join(',')})`;

        sql += ` REFERENCES "${foreignKeyDef.references.table}" (${foreignKeyDef.references.columns.map((v) => { return `"${v}"` }).join(',')})`;

        // TODO ON DELETE
        // TODO ON UPDATE
        // TODO MATCH
        // TODO [NOT] DEFERRABLE

        return sql;
    }

    async createTable(tableName, tableDef) {
        let sql = [];
        // TODO schema-name.
        // TODO TEMP|TEMPORARY
        // TODO IF NOT EXISTS

        if (!"columns" in tableDef) {
            throw new Error("Table definition must contain columns");
        }
        for (let columnName in tableDef.columns) {
            sql.push(this._getColumnDdl(columnName, tableDef.columns[columnName]));
        }

        if ("primaryKey" in tableDef) {
            sql.push(this._getPrimaryKeyDdl(tableDef.primaryKey));
        }

        // TODO UNIQUE
        // TODO CHECK

        if ("foreignKeys" in tableDef) {
            tableDef.foreignKeys.map((v) => {
                sql.push(this._getForeignKeyDdl(v));
            });
        }

        sql = `CREATE TABLE "${tableName}" (${sql.join(', ')})`;

        console.log(sql);
        return new Promise((resolve, reject) => {
            this.connection.exec(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async alterTable(tableName, tableDef) {
        console.log(`ALTER TABLE ${tableName}`);
    }

    async exec(sql) {
        return new Promise((resolve, reject) => {
            this.connection.exec(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async close() {
        return new Promise((resolve, reject) => {
            console.info(`Disconnecting from sqlite3 database...`);
            this.connection.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
            this.connection = undefined;
        })
    }

    async finalize() {
        await this.close();
    }
}
