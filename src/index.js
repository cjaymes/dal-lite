"use strict";
/** @module */

import { readFile } from "fs/promises";

/**
 * Table specifier. Can be a string, an array or an object.
 * If a string, the simple (no schema) name of the table.
 * If an array, it must have a length of 2; the first element is the schema, the second element is the table name.
 * If an object, it must have a property tableName that is the name of the table and an optional property schema that is the name of the schema.
 * @typedef {string|object|string[]} TableSpec
 * @property {string} table The table name
 * @property {string} schema The table schema
 */

/**
 * Column definition.
 * @typedef {object} ColumnDef
 * @property {string} type Type of the column (based on types compatible with underlying DAL)
 * @property {boolean} [notNull] True if column can contain NULL values. Defaults to false.
 */

/**
 * Primary key definition. Can be a column name or an array of column names.
 * @typedef {(string|string[])} PrimaryKeyDef
 */

/**
 * Foreign key definition.
 * @typedef {object} ForeignKeyDef
 * @property {(string|string[])} columns Array of column names or string of a singular column name
 * @property {object} references Definition of the target the column references.
 * @property {string} references.table Name of the table referenced.
 * @property {(string|string[])} references.columns Names of the columns or singular name referenced by this foreign key. Should match up with .columns
 */

/**
 * Table definition.
 * @typedef {object} TableDef
 * @property {Object.<string, ColumnDef>} columns Object keyed with column names mapping to ColumnDefs
 * @property {PrimaryKeyDef} [primaryKey] Primary key definition
 * @property {ForeignKeyDef[]} [foreignKeys] Definitions of foreign keys within the table
 */

/**
 * Index definition.
 * @typedef {object} IndexDef
 * TODO
 */

/**
 * View definition.
 * @typedef {object} ViewDef
 * TODO
 */

/**
 * Database schema definition.
 * @typedef {object} DataDef
 * @property {TableDef[]} tables The individual TableDefs
 * @property {IndexDef[]} indexes The individual IndexDefs
 * @property {ViewDef[]} views The individual ViewDefs
 */

/**
 * Change to apply to a table's data
 * @typedef {object} ChangeDef
 * @property {string} column The column to update
 * @property {*} value The new value of the column
 */

/** Abstract class that selects a DAL for a given connection string (URI) via @function getDal */
class Dal {
    /**
     * @constructor
     * @param {string} uri  Connection string used to attach to the database
     * @param {object} [_options] Options
     */
    constructor(uri, _options = {}) {
        // TODO cache multiple connections

        this.uri = uri;
    }

    /**
     * Gets the underlying DAL type of this DAL
     * @abstract
     * @returns {string} The underlying DAL type
     */
    get type() {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Connects the specified database. This is only necessary if you specified connect=false in the options to getDal
     * @abstract
     * @param {object} [_options] Options
     * @returns {Promise}
     */
    async connect(_options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Checks if a table exists
     * @abstract
     * @param {TableSpec} table Table specifier
     * @param {object} [_options] Options
     * @returns {Promise}
     */
    async tableExists(table, _options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Creates a table from a given table definition
     * @abstract
     * @param {TableSpec} table Table specifier {@link TableSpec}
     * @param {TableDef} tableDef Table definition
     * @param {object} [_options] Options
     * @returns {Promise}
     */
    async createTable(table, tableDef, _options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Alters an existing table to match a given table definition
     * @abstract
     * @param {TableSpec} table Table specifier
     * @param {object} defChanges Changes to apply to table
     * @param {object} [_options] Options
     * @returns {Promise} Promise that resolves when table is altered or rejects for errors
     */
    async alterTable(table, defChanges, _options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     *
     * @abstract
     * @param {TableSpec} table Table specifier
     * @param {object} [_options] Options
     * @returns {Promise} Promise that resolves for successful table drop or rejects for errors
     */
    async dropTable(table, _options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Quotes a given identifier (e.g. table, column name)
     * @abstract
     * @param {string} name
     * @param {object} [_options] Options
     * @returns {string} Quoted name
     */
    quoteIdentifier(name, _options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Quotes a given value according to a specified type
     * @abstract
     * @param {*} value
     * @param {string} type
     * @param {object} [_options] Options
     * @returns {string} Quoted value
     */
    quoteValue(value, type, _options = {}) {
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

    /**
     * Executes a given SQL query that does not return data
     * @abstract
     * @param {string} sql The query
     * @param {object} [_options] Options
     * @returns {Promise}   Promise that will resolve with no data or reject
     */
    async exec(sql, _options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Run a query that returns data from the database.
     * @abstract
     * @param {string} sql The query
     * @param {object} [_options] Options
     * @returns {Promise} Promise that resolves with data or rejects
     */
    async query(sql, _options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Insert data into the database.
     * @abstract
     * @param {TableSpec} into Table specifier
     * @param {(object|object[])} values Array or singular column to value map (object where keys are the column name and the values are the values for the column).
     * @param {object} [_options] Options
     * @returns {Promise} Promise that resolves for a successful insert or rejects
     */
    async insert(into, values, _options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Update data within the database.
     * @abstract
     * @param {TableSpec} table Table specifier
     * @param {ChangeDef[]} changes
     * @param {object} [_options] Options
     * @param {string} _options.where Where clause
     * @returns {Promise} Promise that resolves for a successful update or rejects
     */
    async update(table, changes, _options = null) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Select data from the database
     * @abstract
     * @param {string[]} columns
     * @param {TableSpec} from Table specifier
     * @param {object} [_options] Options
     * @param {string} _options.where Where clause
     * @param {string} _options.groupBy Group by clause
     * @param {string} _options.orderBy Order by clause
     * @param {number} _options.limit.limit Limit results to this value
     * @param {number} _options.limit.offset Offset results by this value
     * @returns {Promise} Promise that resolves with returned data or rejects
     */
    async select(columns, from, _options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Delete data from the database.
     * @abstract
     * @param {TableSpec} from Table specifier TODO joins, etc.
     * @param {object} [_options] Options
     * @param {string} _options.where Where clause
     * @returns {Promise} Promise that resolves with a successful delete or rejects
     */
    async delete(from, _options = {}) {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Uses a DataDef to specify a desired database schema state.
     * @param {DataDef} def DataDef describing the expected state of the database
     * @param {object} [_options] Options
     * @returns {Promise} Promise that resolves for successful application or rejects
     */
    async applyDataDefinition(def, _options = {}) {
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

    /**
     * Closes the connection to the database. The instance should not be used after this.
     * @abstract
     * @returns {Promise} Promise that resolves when the connection is closed or rejects for errors
     */
    async close() {
        throw new Error(
            `Child class ${this.constructor.name} doesn't implement ${
                new Error().stack.split("\n")[1].trim().split(" ")[1]
            } function`
        );
    }

    /**
     * Given a connection string (URI) chooses a matching subclass of Dal that implements that database dialect and instantiates it
     * @param {string} uri Connection string/URI
     * @param {object} [_options] Options
     * @param {boolean} [_options.connect] Auto-connect to the database. Defaults to true.
     * @returns {Dal} The subclass of Dal for the database type specified by the uri
     */
    static async getDal(uri, _options = {}) {
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

        if ("connect" in _options && !_options.connect) {
            console.info("Not auto-connecting new DAL");
            return dal;
        } else {
            return dal.connect();
        }
        // TODO auto-update schema?
    }
}

export default Dal;
