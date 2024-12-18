"use strict";

import sqlite3 from "sqlite3";
import Dal from "../index.js";
import { resolve } from "path";
import { rejects } from "assert";

sqlite3.verbose();

export default class SqliteDal extends Dal {
    constructor(uri) {
        super(uri);
    }

    get type() {
        return "sqlite3";
    }

    async connect() {
        const filename = this.uri.split(":", 2)[1];
        console.info(`Opening sqlite3 database ${filename}...`);
        return new Promise((resolve, reject) => {
            this.connection = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
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
                            console.debug(`${tableName} table does not exist`);
                        } else {
                            console.debug(`${tableName} table exists`);
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

        if (Array.isArray(primaryKeyDef)) {
            sql += primaryKeyDef.map((v) => { return `"${v}"` }).join(", ");
        } else if (typeof primaryKeyDef === "string") {
            sql += `"${primaryKeyDef}"`;
        } else {
            throw new Error("primary key definition should be an array or a string");
        }

        sql += ")";
        // TODO conflict-clause
        return sql;
    }

    _getForeignKeyDdl(foreignKeyDef) {
        if (!("columns" in foreignKeyDef) || !("references" in foreignKeyDef) || !("table" in foreignKeyDef.references) || !("columns" in foreignKeyDef.references)) {
            throw new Error("foreign key definition requires columns & references & references.table & references.columns");
        }
        console.debug(
            `foreignKey: ${JSON.stringify(foreignKeyDef)}`
        );

        let sql;

        if (Array.isArray(foreignKeyDef.columns)) {
            sql = `FOREIGN KEY (${foreignKeyDef.columns.map((v) => { return `"${v}"` }).join(',')})`;
        } else if (typeof foreignKeyDef.columns === "string") {
            sql = `FOREIGN KEY ("${foreignKeyDef.columns}")`;
        } else {
            throw new Error("foreign key columns definition should be an array or a string");
        }

        if (Array.isArray(foreignKeyDef.references.columns)) {
            sql += ` REFERENCES "${foreignKeyDef.references.table}" (${foreignKeyDef.references.columns.map((v) => { return `"${v}"` }).join(',')})`;
        } else if (typeof foreignKeyDef.references.columns === "string") {
            sql += ` REFERENCES "${foreignKeyDef.references.table}" ("${foreignKeyDef.references.columns}")`;
        } else {
            throw new Error("foreign key references columns definition should be an array or a string");
        }

        // TODO ON DELETE
        // TODO ON UPDATE
        // TODO MATCH
        // TODO [NOT] DEFERRABLE

        return sql;
    }

    _getTableDdl(tableName, tableDef) {
        let sql = [];
        // TODO schema-name.
        // TODO TEMP|TEMPORARY
        // TODO IF NOT EXISTS

        if (!("columns" in tableDef) || (typeof tableDef !== 'object')) {
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

        return `CREATE TABLE "${tableName}" (${sql.join(', ')})`;
    }

    async createTable(tableName, tableDef) {
        const sql = this._getTableDdl(tableName, tableDef);
        console.debug(sql);

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

    // TODO alterTable
    // TODO dropTable

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

    async query(sql) {
        return new Promise((resolve, reject) => {
            this.connection.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    _quoteName(name) {
        return `"${name}"`;
    }

    _quoteValue(value, type) {
        // convert special values
        if (value === null) {
            return 'NULL';
        } else if (value === true) {
            return 'TRUE';
        } else if (value === false) {
            return 'FALSE';
        }

        if (['NULL', 'INTEGER', 'REAL'].includes(type)) {
            return value;
        } else {
            // TODO escape " characters within TEXT/BLOBs
            return `'${value}'`;
        }
    }

    async _getColumnTypes(tableName, _schemaName=null) {
        let tableInfo;
        // TODO cache tableInfo
        if (_schemaName) {
            tableInfo = await this.query(`PRAGMA table_info(${this._quoteName(_schemaName) + '.' + this._quoteName(tableName)})`);
        } else {
            tableInfo = await this.query(`PRAGMA table_info(${this._quoteName(tableName)})`);
        }
        console.debug('tableInfo for ' + tableName + JSON.stringify(tableInfo))

        // parse column types from results
        let colTypes = {};
        for (let col of tableInfo) {
            colTypes[col.name] = col.type;
        }
        return colTypes;
    }

    async insert(into, values) {
        return new Promise(async (resolve, reject) => {
            let sql = ['INSERT'];

            // TODO WITH
            // TODO REPLACE?
            // TODO OR ABORT|FAIL|IGNORE|REPLACE|ROLLBACK

            sql.push('INTO');
            let colTypes;
            if (typeof into === 'string') {
                // it's a table name
                sql.push(this._quoteName(into));
                // get column types for quoting
                colTypes = await this._getColumnTypes(into);
            } else if (typeof into === 'object') {
                let into_clause;
                if (!('table' in into)) {
                    throw new Error('insert() into parameter requires table');
                }
                if ('schema' in into) {
                    into_clause = this._quoteName(into.schema);
                    // get column types for quoting
                    colTypes = await this._getColumnTypes(into.table, into.schema);
                } else {
                    // get column types for quoting
                    colTypes = await this._getColumnTypes(into.table);
                }
                into_clause += into.table;
                if ('as' in into) {
                    into_clause += ' AS ' + this._quoteName(into.as);
                }
                sql.push(into_clause);
            } else {
                throw new Error("Unknown insert() into parameter");
            }

            // TODO INSERT INTO table SELECT ...
            // TODO INSERT INTO table DEFAULT VALUES;

            if (Array.isArray(values)) {
                if (values.length <= 0 || !(typeof values[0] === 'object')) {
                    // TODO check all the values?
                    throw new Error('insert() values is not an array of objects or one object')
                }

                // pull column names from values[0]
                const colNames = Object.keys(values[0]).sort();
                sql.push('(' + colNames.map((v) => { return this._quoteName(v) }).join(', ') + ')');

                sql.push('VALUES');
                for (v of values) {
                    sql.push('(' + colNames.map((col) => { return this._quoteValue(v[col], colTypes[col]) }).join(', ') + ')');
                }

            } else if (typeof values === 'object') {
                // pull column names from values
                const colNames = Object.keys(values).sort();
                sql.push('(' + colNames.map((v) => { return this._quoteName(v) }).join(', ') + ')');

                sql.push('VALUES');
                sql.push('(' + colNames.map((col) => { return this._quoteValue(values[col], colTypes[col]) }).join(', ') + ')');
            } else {
                throw new Error('insert() values is not an array of objects or one object')
            }

            // TODO upsert-clause
            // TODO returning-clause?

            sql = sql.join(' ');
            console.debug(sql);
            this.connection.run(sql, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            })
        })
    }

    // async update(tableName, changes, _where) {
    // }

    // async select(from, _where, _groupBy) {
    // }

    // async delete(from, _where, _orderBy, _limit) {
    // }

    // features from SQLite
    // TODO strict type checking
    // TODO schema; attach & detach, automatically?

    // features from API
    // MAYBE configure
    // TODO run (only way to get last id or changed count)
    // TODO get
    // TODO all
    // TODO each
    // TODO prepare
    // TODO map
    // MAYBE loadExtension
    // MAYBE interrupt

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
