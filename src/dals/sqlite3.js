"use strict";

import sqlite3 from "sqlite3";
import Dal from "../index.js";
import { resolve } from "path";
import { rejects } from "assert";

sqlite3.verbose();

export default class SqliteDal extends Dal {
    constructor(uri) {
        super(uri);

        this._columnTypeCache = {};
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

    _getTableSpec(table) {
        if (Array.isArray(table) && table.length === 1) {
            return this.quoteIdentifier(table[1]);
        } else if (Array.isArray(table) && table.length === 2) {
            return `${this.quoteIdentifier(table[0])}.${this.quoteIdentifier(table[1])}`;
        } else if ((typeof table) === 'object' && 'schema' in table && 'table' in table) {
            return `${this.quoteIdentifier(table.schema)}.${this.quoteIdentifier(table.table)}`;
        } else if ((typeof table) === 'object' && 'table' in table) {
            return this.quoteIdentifier(table.table);
        } else if ((typeof table) === 'string') {
            return this.quoteIdentifier(table);
        } else {
            throw new Error("Invalid table specifier: must be array (of length 1 or 2), object (with table and optionally schema keys) or string");
        }
    }

    _getTableDdl(table, tableDef) {
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

        return `CREATE TABLE ${this._getTableSpec(table)} (${sql.join(', ')})`;
    }

    async createTable(table, tableDef) {
        // TODO create this._columnTypeCache[cacheKey]
        const sql = this._getTableDdl(table, tableDef);
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
    //  TODO delete this._columnTypeCache[cacheKey]
    // TODO dropTable
    //  TODO delete this._columnTypeCache[cacheKey]
    async dropTable(table) {
        return new Promise((resolve, reject) => {
            this.connection.exec(`DROP TABLE ${this._getTableSpec(table) }`, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
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

    quoteIdentifier(name) {
        return `"${name}"`;
    }

    quoteValue(value, type) {
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
        } else if (type === 'TEXT') {
            return `'${value.replace(/'/g, "''")}'`;
        } else if (type === 'BLOB') {
            // TODO can we assume no ' in BLOB strings?
            return `x'${value}'`;
        } else {
            throw new Error(`Unknown type: ${type} when quoting value`)
        }
    }

    async _getColumnTypes(table) {
        let tableInfo;

        let cacheKey;
        if (Array.isArray(table) && table.length === 1) {
            cacheKey = this.quoteIdentifier(table[1]);
        } else if (Array.isArray(table) && table.length === 2) {
            if (table[0] !== 'main') {
                throw new Error(`Can't get table_info for non-main table: ${this.quoteIdentifier(table[0])}.${this.quoteIdentifier(table[1])}`)
            } else {
                cacheKey = `${this.quoteIdentifier(table[1])}`;
            }
        } else if ((typeof table) === 'object' && 'schema' in table && 'table' in table) {
            if (table.schema !== 'main') {
                throw new Error(`Can't get table_info for non-main table: ${this.quoteIdentifier(table.schema)}.${this.quoteIdentifier(table.table)}`)
            } else {
                cacheKey = `${this.quoteIdentifier(table.table)}`;
            }
        } else if ((typeof table) === 'object' && 'table' in table) {
            cacheKey = this.quoteIdentifier(table.table);
        } else if ((typeof table) === 'string') {
            cacheKey = this.quoteIdentifier(table);
        } else {
            throw new Error("Invalid table specifier: must be array (of length 1 or 2), object (with table and optionally schema keys) or string");
        }

        if (cacheKey in this._columnTypeCache) {
            console.debug('_getColumnTypes cache hit for ' + cacheKey)
            return structuredClone(this._columnTypeCache[cacheKey]);
        }

        tableInfo = await this.query(`PRAGMA table_info(${cacheKey})`);

        console.debug('Retrieved table_info for ' + cacheKey + ': ' + JSON.stringify(tableInfo))

        // parse column types from results
        let colTypes = {};
        for (let col of tableInfo) {
            colTypes[col.name] = col.type;
        }

        // copy to cache
        this._columnTypeCache[cacheKey] = structuredClone(colTypes);

        return colTypes;
    }

    async insert(table, values) {
        return new Promise(async (resolve, reject) => {
            let sql = ['INSERT'];

            // TODO WITH
            // TODO REPLACE?
            // TODO OR ABORT|FAIL|IGNORE|REPLACE|ROLLBACK

            sql.push('INTO');

            // get column types for quoting
            let colTypes = await this._getColumnTypes(table);

            if (typeof table === 'string') {
                // it's a table name
                sql.push(this._getTableSpec(table));
            } else if (typeof table === 'object') {
                let into_clause = this._getTableSpec(table);
                if ('as' in table) {
                    into_clause += ' AS ' + this.quoteIdentifier(table.as);
                }
                sql.push(into_clause);
            } else {
                throw new Error("Unknown insert() into parameter; should be string or object");
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
                sql.push('(' + colNames.map((v) => { return this.quoteIdentifier(v) }).join(', ') + ')');

                sql.push('VALUES');
                let valueClause = [];
                for (let v of values) {
                    valueClause.push('(' + colNames.map((col) => { return this.quoteValue(v[col], colTypes[col]) }).join(', ') + ')');
                }
                sql.push(valueClause.join(', '))

            } else if (typeof values === 'object') {
                // pull column names from values
                const colNames = Object.keys(values).sort();
                sql.push('(' + colNames.map((v) => { return this.quoteIdentifier(v) }).join(', ') + ')');

                sql.push('VALUES');
                sql.push('(' + colNames.map((col) => { return this.quoteValue(values[col], colTypes[col]) }).join(', ') + ')');
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

    async update(table, changes, _options = null) {
        return new Promise(async (resolve, reject) => {
            // TODO WITH
            let sql = ['UPDATE'];

            // TODO OR ABORT|FAIL|IGNORE|REPLACE|ROLLBACK

            // get column types for quoting
            let colTypes = await this._getColumnTypes(table);

            if (typeof table === 'string') {
                // it's a table name
                sql.push(this._getTableSpec(table));
            } else if (typeof table === 'object') {
                let table_clause = this._getTableSpec(table);
                if ('as' in table) {
                    table_clause += ' AS ' + this.quoteIdentifier(table.as);
                }
                sql.push(table_clause);
            } else {
                throw new Error("Unknown update() table parameter; should be string or object");
            }

            sql.push('SET');
            // TODO column-name-list for FROM
            if (typeof changes !== 'object') {
                throw new Error("Unknown update() changes parameter; should be an object")
            }
            let colAssignments = [];
            for (let colName in changes) {
                colAssignments.push(`${this.quoteIdentifier(colName)} = ${this.quoteValue(changes[colName], colTypes[colName])}`)
            }
            sql.push(colAssignments.join(', '))

            // TODO FROM
            // TODO WHERE

            sql = sql.join(' ');
            console.debug(sql);
            this.connection.run(sql, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            })
        })
    }

    _getFromClause(from) {
        // TODO add join-clause/multi-table support
        if (typeof from === 'string') {
            // it's a table name
            return (this._getTableSpec(from));
        } else if (typeof from === 'object') {
            // TODO add join-clause/multi-table support
            let from_clause = this._getTableSpec(from);
            if ('as' in from) {
                from_clause += ' AS ' + this.quoteIdentifier(from.as);
            }
            return (from_clause);
        } else {
            throw new Error("Unknown select() from parameter; should be string or object");
        }
    }

    async select(columns, from, _options = null) {
        return new Promise(async (resolve, reject) => {
            let sql = [];

            // TODO WITH
            // TODO VALUES clause
            // TODO compound-operator

            sql.push('SELECT');
            // TODO DISTINCT
            // TODO ALL

            if (Array.isArray(columns)) {
                sql.push(columns.map((v) => { return this.quoteIdentifier(v) }).join(', '));
            } else if (typeof columns === 'string') {
                if (columns === '*') {
                    sql.push(columns);
                } else {
                    sql.push(this.quoteIdentifier(columns));
                }
            } else {
                throw new Error(`Unsupported columns parameter; array & string are supported`)
            }

            sql.push('FROM')

            sql.push(this._getFromClause(from));

            // get column types for quoting
            let colTypes = await this._getColumnTypes(from);

            // TODO WHERE
            //  quote with colTypes
            // TODO GROUP BY
            // TODO WINDOW
            // TODO ORDER BY
            // TODO LIMIT

            sql = sql.join(' ');
            console.debug(sql);
            this.connection.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    async delete(table, _options = null) {
        return new Promise(async (resolve, reject) => {
            let sql = [];
            // TODO WITH
            sql.push('DELETE FROM');

            sql.push(this._getFromClause(table));

            // get column types for quoting
            let colTypes = await this._getColumnTypes(table);

            // TODO WHERE
            //  quote with colTypes
            // TODO RETURNING

            sql = sql.join(' ');
            console.debug(sql);
            this.connection.run(sql, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            })
        })
    }

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
