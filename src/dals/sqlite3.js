"use strict";

/** @module */

import sqlite3 from "sqlite3";
import Dal from "../index.js";

sqlite3.verbose();
/** DAL that connects to sqlite3 databases
 * @extends Dal
 * @see module:index~Dal
 */
class SqliteDal extends Dal {
    /**
     * @see module:index.Dal
     */
    constructor(uri, _options = {}) {
        super(uri, _options);

        this._columnTypeCache = {};
    }

    /**
     * @see module:index.Dal#type
     */
    get type() {
        return "sqlite3";
    }

    /**
     * @see Dal.connect
     */
    async connect(_options = {}) {
        if (
            "connection" in this &&
            this.connection &&
            this.connection instanceof SqliteDal
        ) {
            console.warn(`Database is already connected...`);
            return this;
        }

        const filename = this.uri.split(":", 2)[1];
        console.info(`Opening sqlite3 database ${filename}...`);
        return new Promise((resolve, reject) => {
            this.connection = new sqlite3.Database(
                filename,
                sqlite3.OPEN_READWRITE |
                    sqlite3.OPEN_CREATE |
                    sqlite3.OPEN_FULLMUTEX,
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                }
            );
        });
    }

    /**
     * @see Dal.tableExists
     */
    async tableExists(table, _options = {}) {
        let sql;
        let params = [];
        if (typeof table === "string") {
            sql =
                "SELECT name FROM sqlite_schema WHERE type='table' AND name=?;";
            params.push(table);
        } else if (typeof table === "object" && "table" in table) {
            if ("schema" in table && table.schema !== "master") {
                throw new "Table specifiers with .schema other than master are not supported"();
            }
            sql =
                "SELECT name FROM sqlite_schema WHERE type='table' AND name=?;";
            params.push(table.table);
        } else if (Array.isArray(table) && table.length === 1) {
            sql =
                "SELECT name FROM sqlite_schema WHERE type='table' AND name=?;";
            params.push(table[0]);
        } else if (Array.isArray(table) && table.length === 2) {
            if (table[0] !== "master") {
                throw new "Table specifiers with [0] other than master are not supported"();
            }
            sql =
                "SELECT name FROM sqlite_schema WHERE type='table' AND name=?;";
            params.push(table[1]);
        } else {
            throw new Error(
                "Invalid table specifier: must be array (of length 1 or 2), object (with table and optionally schema keys) or string"
            );
        }
        return new Promise((resolve, reject) => {
            this.connection.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (row === undefined) {
                        console.debug(
                            `${JSON.stringify(table)} table does not exist`
                        );
                    } else {
                        console.debug(`${JSON.stringify(table)} table exists`);
                    }
                    resolve(row !== undefined);
                }
            });
        });
    }

    _getColumnDdl(columnName, columnDef) {
        if (!Object.hasOwn(columnDef, "type")) {
            throw new Error(`columns require type`);
        }

        let sql = `"${columnName}"`;

        console.debug(`column: ${columnName} ${JSON.stringify(columnDef)}`);

        if (
            !["NULL", "INTEGER", "REAL", "TEXT", "BLOB"].includes(
                columnDef.type
            )
        ) {
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
        sql = "PRIMARY KEY (";

        if (Array.isArray(primaryKeyDef)) {
            sql += primaryKeyDef
                .map((v) => {
                    return this.quoteIdentifier(v);
                })
                .join(", ");
        } else if (typeof primaryKeyDef === "string") {
            sql += this.quoteIdentifier(primaryKeyDef);
        } else {
            throw new Error(
                "primary key definition should be an array or a string"
            );
        }

        sql += ")";
        // TODO conflict-clause
        return sql;
    }

    _getForeignKeyDdl(foreignKeyDef) {
        if (
            !("columns" in foreignKeyDef) ||
            !("references" in foreignKeyDef) ||
            !("table" in foreignKeyDef.references) ||
            !("columns" in foreignKeyDef.references)
        ) {
            throw new Error(
                "foreign key definition requires columns & references & references.table & references.columns"
            );
        }
        console.debug(`foreignKey: ${JSON.stringify(foreignKeyDef)}`);

        let sql;

        if (Array.isArray(foreignKeyDef.columns)) {
            sql = `FOREIGN KEY (${foreignKeyDef.columns
                .map((v) => {
                    return `"${v}"`;
                })
                .join(",")})`;
        } else if (typeof foreignKeyDef.columns === "string") {
            sql = `FOREIGN KEY ("${foreignKeyDef.columns}")`;
        } else {
            throw new Error(
                "foreign key columns definition should be an array or a string"
            );
        }

        if (Array.isArray(foreignKeyDef.references.columns)) {
            sql += ` REFERENCES "${
                foreignKeyDef.references.table
            }" (${foreignKeyDef.references.columns
                .map((v) => {
                    return `"${v}"`;
                })
                .join(",")})`;
        } else if (typeof foreignKeyDef.references.columns === "string") {
            sql += ` REFERENCES "${foreignKeyDef.references.table}" ("${foreignKeyDef.references.columns}")`;
        } else {
            throw new Error(
                "foreign key references columns definition should be an array or a string"
            );
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
            return `${this.quoteIdentifier(table[0])}.${this.quoteIdentifier(
                table[1]
            )}`;
        } else if (
            typeof table === "object" &&
            "schema" in table &&
            "table" in table
        ) {
            return `${this.quoteIdentifier(
                table.schema
            )}.${this.quoteIdentifier(table.table)}`;
        } else if (typeof table === "object" && "table" in table) {
            return this.quoteIdentifier(table.table);
        } else if (typeof table === "string") {
            return this.quoteIdentifier(table);
        } else {
            throw new Error(
                "Invalid table specifier: must be array (of length 1 or 2), object (with table and optionally schema keys) or string"
            );
        }
    }

    _getTableDdl(table, tableDef) {
        let sql = [];
        // TODO schema-name.
        // TODO TEMP|TEMPORARY
        // TODO IF NOT EXISTS

        if (!("columns" in tableDef) || typeof tableDef !== "object") {
            throw new Error("Table definition must contain columns");
        }
        for (let columnName in tableDef.columns) {
            sql.push(
                this._getColumnDdl(columnName, tableDef.columns[columnName])
            );
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

        return `CREATE TABLE ${this._getTableSpec(table)} (${sql.join(", ")})`;
    }

    /**
     * @see Dal.createTable
     */
    async createTable(table, tableDef, _options = {}) {
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

    /**
     * @see Dal.dropTable
     */
    async dropTable(table, _options = {}) {
        return new Promise((resolve, reject) => {
            delete this._columnTypeCache[this._getTableCacheKey(table)];
            this.connection.exec(
                `DROP TABLE ${this._getTableSpec(table)}`,
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    /**
     * @see Dal.exec
     */
    async exec(sql, _options = {}) {
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

    /**
     * @see Dal.query
     */
    async query(sql, _options = {}) {
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

    /**
     * @see Dal.quoteIdentifier
     */
    quoteIdentifier(name, _options = {}) {
        return `"${name}"`;
    }

    /**
     * @see Dal.quoteValue
     */
    quoteValue(value, type, _options = {}) {
        // convert special values
        if (value === null) {
            return "NULL";
        } else if (value === true) {
            return "TRUE";
        } else if (value === false) {
            return "FALSE";
        }

        if (["NULL", "INTEGER", "REAL"].includes(type)) {
            return value;
        } else if (type === "TEXT") {
            return `'${value.replace(/'/g, "''")}'`;
        } else if (type === "BLOB") {
            // TODO can we assume no ' in BLOB strings?
            return `x'${value}'`;
        } else {
            throw new Error(`Unknown type: ${type} when quoting value`);
        }
    }

    _getTableCacheKey(table) {
        if (Array.isArray(table) && table.length === 1) {
            return this.quoteIdentifier(table[1]);
        } else if (Array.isArray(table) && table.length === 2) {
            if (table[0] !== "main") {
                throw new Error(
                    `Can't get table_info for non-main table: ${this.quoteIdentifier(
                        table[0]
                    )}.${this.quoteIdentifier(table[1])}`
                );
            } else {
                return `${this.quoteIdentifier(table[1])}`;
            }
        } else if (
            typeof table === "object" &&
            "schema" in table &&
            "table" in table
        ) {
            if (table.schema !== "main") {
                throw new Error(
                    `Can't get table_info for non-main table: ${this.quoteIdentifier(
                        table.schema
                    )}.${this.quoteIdentifier(table.table)}`
                );
            } else {
                return `${this.quoteIdentifier(table.table)}`;
            }
        } else if (typeof table === "object" && "table" in table) {
            return this.quoteIdentifier(table.table);
        } else if (typeof table === "string") {
            return this.quoteIdentifier(table);
        } else {
            throw new Error(
                "Invalid table specifier: must be array (of length 1 or 2), object (with table and optionally schema keys) or string"
            );
        }
    }

    async _getColumnTypes(table) {
        let tableInfo;

        let cacheKey = this._getTableCacheKey(table);

        if (cacheKey in this._columnTypeCache) {
            console.debug("_getColumnTypes cache hit for " + cacheKey);
            return structuredClone(this._columnTypeCache[cacheKey]);
        }

        tableInfo = await this.query(`PRAGMA table_info(${cacheKey})`);

        console.debug(
            "Retrieved table_info for " +
                cacheKey +
                ": " +
                JSON.stringify(tableInfo)
        );

        // parse column types from results
        let colTypes = {};
        for (let col of tableInfo) {
            colTypes[col.name] = col.type;
        }

        // copy to cache
        this._columnTypeCache[cacheKey] = structuredClone(colTypes);

        return colTypes;
    }

    /**
     * @see Dal.insert
     */
    async insert(table, values, _options = {}) {
        return new Promise(async (resolve, reject) => {
            let sql = ["INSERT"];

            // TODO WITH
            // TODO REPLACE?
            // TODO OR ABORT|FAIL|IGNORE|REPLACE|ROLLBACK

            sql.push("INTO");

            // get column types for quoting
            let colTypes = await this._getColumnTypes(table);

            if (typeof table === "string") {
                // it's a table name
                sql.push(this._getTableSpec(table));
            } else if (typeof table === "object") {
                let into_clause = this._getTableSpec(table);
                if ("as" in table) {
                    into_clause += " AS " + this.quoteIdentifier(table.as);
                }
                sql.push(into_clause);
            } else {
                throw new Error(
                    "Unknown insert() into parameter; should be string or object"
                );
            }

            // TODO INSERT INTO table SELECT ...
            // TODO INSERT INTO table DEFAULT VALUES;

            if (Array.isArray(values)) {
                if (values.length <= 0 || !(typeof values[0] === "object")) {
                    // TODO check all the values?
                    throw new Error(
                        "insert() values is not an array of objects or one object"
                    );
                }

                // pull column names from values[0]
                const colNames = Object.keys(values[0]).sort();
                sql.push(
                    "(" +
                        colNames
                            .map((v) => {
                                return this.quoteIdentifier(v);
                            })
                            .join(", ") +
                        ")"
                );

                sql.push("VALUES");
                let valueClause = [];
                for (let v of values) {
                    valueClause.push(
                        "(" +
                            colNames
                                .map((col) => {
                                    return this.quoteValue(
                                        v[col],
                                        colTypes[col]
                                    );
                                })
                                .join(", ") +
                            ")"
                    );
                }
                sql.push(valueClause.join(", "));
            } else if (typeof values === "object") {
                // pull column names from values
                const colNames = Object.keys(values).sort();
                sql.push(
                    "(" +
                        colNames
                            .map((v) => {
                                return this.quoteIdentifier(v);
                            })
                            .join(", ") +
                        ")"
                );

                sql.push("VALUES");
                sql.push(
                    "(" +
                        colNames
                            .map((col) => {
                                return this.quoteValue(
                                    values[col],
                                    colTypes[col]
                                );
                            })
                            .join(", ") +
                        ")"
                );
            } else {
                throw new Error(
                    "insert() values is not an array of objects or one object"
                );
            }

            // TODO upsert-clause
            // TODO returning-clause?

            sql = sql.join(" ");
            console.debug(sql);
            this.connection.run(sql, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    /**
     * @see Dal.update
     */
    async update(table, changes, _options = {}) {
        return new Promise(async (resolve, reject) => {
            // TODO WITH

            let sql = ["UPDATE"];

            // TODO OR ABORT|FAIL|IGNORE|REPLACE|ROLLBACK

            // get column types for quoting
            let colTypes = await this._getColumnTypes(table);

            if (typeof table === "string") {
                // it's a table name
                sql.push(this._getTableSpec(table));
            } else if (typeof table === "object") {
                let table_clause = this._getTableSpec(table);
                if ("as" in table) {
                    table_clause += " AS " + this.quoteIdentifier(table.as);
                }
                sql.push(table_clause);
            } else {
                throw new Error(
                    "Unknown update() table parameter; should be string or object"
                );
            }

            sql.push("SET");
            // TODO column-name-list for FROM
            if (typeof changes !== "object") {
                throw new Error(
                    "Unknown update() changes parameter; should be an object"
                );
            }
            let colAssignments = [];
            for (let colName in changes) {
                colAssignments.push(
                    `${this.quoteIdentifier(colName)} = ${this.quoteValue(
                        changes[colName],
                        colTypes[colName]
                    )}`
                );
            }
            sql.push(colAssignments.join(", "));

            // TODO FROM

            const whereClause = this._getWhereClause(_options, colTypes);
            if (whereClause) {
                sql.push(whereClause);
            }

            sql = sql.join(" ");
            console.debug(sql);
            this.connection.run(sql, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    _getFromClause(from) {
        // TODO add join-clause/multi-table support
        if (typeof from === "string") {
            // it's a table name
            return this._getTableSpec(from);
        } else if (typeof from === "object") {
            // TODO add join-clause/multi-table support
            let from_clause = this._getTableSpec(from);
            if ("as" in from) {
                from_clause += " AS " + this.quoteIdentifier(from.as);
            }
            return from_clause;
        } else {
            throw new Error(
                "Unknown select() from parameter; should be string or object"
            );
        }
    }

    _getWhereClause(options, colTypes) {
        if (options && "where" in options) {
            if (typeof options.where === "string") {
                return "WHERE " + options.where;
            } else {
                throw new Error(
                    "Unsupported options.where parameter; should be a string"
                );
            }
        } else {
            return null;
        }
    }

    _getGroupByClause(options, colTypes) {
        // TODO HAVING
        if (options && "groupBy" in options) {
            if (typeof options.groupBy === "string") {
                return "GROUP BY " + options.groupBy;
            } else if (Array.isArray(options.groupBy)) {
                return "GROUP BY " + options.groupBy.join(", ");
            } else {
                throw new Error(
                    "Unsupported options.groupBy parameter; should be a string or an array"
                );
            }
        } else {
            return null;
        }
    }

    _getOrderByClause(options, colTypes) {
        if (options && "orderBy" in options) {
            if (typeof options.orderBy === "string") {
                return "ORDER BY " + options.orderBy;
            } else if (Array.isArray(options.orderBy)) {
                return "ORDER BY " + options.orderBy.join(", ");
            } else {
                throw new Error(
                    "Unsupported options.orderBy parameter; should be a string or an array"
                );
            }
        } else {
            return null;
        }
    }

    _getLimitClause(options, colTypes) {
        if (options && "limit" in options) {
            if (typeof options.limit === "number") {
                if ("offset" in options) {
                    if (typeof options.offset === "number") {
                        return `LIMIT ${options.limit} OFFSET ${options.offset}`;
                    } else {
                        throw new Error(
                            "Unsupported options.offset parameter; should be a number"
                        );
                    }
                } else {
                    return "LIMIT " + options.limit;
                }
            } else {
                throw new Error(
                    "Unsupported options.limit parameter; should be a number"
                );
            }
        } else {
            return null;
        }
    }

    /**
     * @see Dal.select
     */
    async select(columns, from, _options = {}) {
        return new Promise(async (resolve, reject) => {
            let sql = [];

            // TODO WITH
            // TODO VALUES clause
            // TODO compound-operator

            sql.push("SELECT");

            // TODO DISTINCT
            // TODO ALL

            if (Array.isArray(columns)) {
                sql.push(
                    columns
                        .map((v) => {
                            return this.quoteIdentifier(v);
                        })
                        .join(", ")
                );
            } else if (typeof columns === "string") {
                if (columns === "*") {
                    sql.push(columns);
                } else {
                    sql.push(this.quoteIdentifier(columns));
                }
            } else {
                throw new Error(
                    `Unsupported columns parameter; array & string are supported`
                );
            }

            sql.push("FROM");

            sql.push(this._getFromClause(from));

            // get column types for quoting
            let colTypes = await this._getColumnTypes(from);

            const whereClause = this._getWhereClause(_options, colTypes);
            if (whereClause) {
                sql.push(whereClause);
            }

            const groupByClause = this._getGroupByClause(_options, colTypes);
            if (groupByClause) {
                sql.push(groupByClause);
            }

            // TODO WINDOW

            const orderByClause = this._getOrderByClause(_options, colTypes);
            if (orderByClause) {
                sql.push(orderByClause);
            }

            const limitClause = this._getLimitClause(_options, colTypes);
            if (limitClause) {
                sql.push(limitClause);
            }

            sql = sql.join(" ");
            console.debug(sql);
            this.connection.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * @see Dal.delete
     */
    async delete(table, _options = {}) {
        return new Promise(async (resolve, reject) => {
            let sql = [];
            // TODO WITH
            sql.push("DELETE FROM");

            sql.push(this._getFromClause(table));

            // get column types for quoting
            let colTypes = await this._getColumnTypes(table);

            const whereClause = this._getWhereClause(_options, colTypes);
            if (whereClause) {
                sql.push(whereClause);
            }

            // TODO RETURNING

            sql = sql.join(" ");
            console.debug(sql);
            this.connection.run(sql, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
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

    /**
     * @see Dal.close
     */
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
        });
    }

    async finalize() {
        await this.close();
    }
}

export default SqliteDal;
