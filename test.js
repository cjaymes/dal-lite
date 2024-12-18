import { afterEach, beforeEach, suite, test } from 'node:test';
import { access, constants, unlink } from 'node:fs/promises';
import Dal from "./src/index.js";

suite('sqlite3 in-memory', async () => {
    test('sqlite dal from sqlite3::memory:', async (t) => {
        const db = await Dal.getDal('sqlite3::memory:');

        t.assert.strictEqual(db.constructor.name, "SqliteDal");
    })
    test('sqlite dal from sqlite::memory:', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db.constructor.name, "SqliteDal");
    })
});

suite('sqlite3 file', async () => {
    test('file creation', async (t) => {
        const db = await Dal.getDal('sqlite:test.sqlite');
        await db.connect();
        await db.close();

        t.assert.strictEqual(await access('./test.sqlite', constants.F_OK), undefined);

        await unlink('./test.sqlite');
    })
    test('exec & table exists', async (t) => {
        const db = await Dal.getDal('sqlite:test.sqlite');
        await db.connect();
        await db.exec('CREATE TABLE "config" ("name" TEXT NOT NULL, "value" TEXT NOT NULL, PRIMARY KEY ("name"))');

        t.assert.strictEqual(await db.tableExists('config'), true);

        await db.close();
        await unlink('./test.sqlite');
    })
    test('create table', async (t) => {
        const db = await Dal.getDal('sqlite:test.sqlite');
        await db.connect();
        await db.createTable('test', { columns: { id: { type: 'INTEGER' } } });

        t.assert.strictEqual(await db.tableExists('test'), true);

        await db.close();
        await unlink('./test.sqlite');
    })
})

suite('sqlite3 ddl', async () => {
    test('column ddl valid types', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getColumnDdl('test', { type: "NULL" }), '"test" NULL')
        t.assert.strictEqual(db._getColumnDdl('test', { type: "INTEGER" }), '"test" INTEGER')
        t.assert.strictEqual(db._getColumnDdl('test', { type: "REAL" }), '"test" REAL')
        t.assert.strictEqual(db._getColumnDdl('test', { type: "TEXT" }), '"test" TEXT')
        t.assert.strictEqual(db._getColumnDdl('test', { type: "BLOB" }), '"test" BLOB')
    })
    test('column ddl invalid types', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getColumnDdl('test', { type: "derp" })
        })
    })
    test('column ddl not null true', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getColumnDdl('test', { type: "INTEGER", notNull: true }), '"test" INTEGER NOT NULL')
    })
    test('primary key ddl column array', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getPrimaryKeyDdl(['id']), 'PRIMARY KEY ("id")')
    })
    test('primary key ddl column string', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getPrimaryKeyDdl('id'), 'PRIMARY KEY ("id")')
    })
    test('foreign key ddl throws for undef columns', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getForeignKeyDdl({ references: 'test' })
        })
    })
    test('foreign key ddl throws for undef references', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getForeignKeyDdl({ columns: ['id'] })
        })
    })
    test('foreign key ddl throws for undef references.table', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getForeignKeyDdl({ columns: ['id'], references: { columns: ['id'] } })
        })
    })
    test('foreign key ddl throws for undef references.columns', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getForeignKeyDdl({ columns: ['id'], references: { table: 'test' } })
        })
    })
    test('foreign key ddl columns array', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getForeignKeyDdl({ columns: ['id'], references: { table: 'test', columns: ['id'] } }), 'FOREIGN KEY ("id") REFERENCES "test" ("id")')
    })
    test('foreign key ddl columns string', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getForeignKeyDdl({ columns: 'id', references: { table: 'test', columns: ['id'] } }), 'FOREIGN KEY ("id") REFERENCES "test" ("id")')
    })
    test('foreign key ddl references.columns array', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getForeignKeyDdl({ columns: ['id'], references: { table: 'test', columns: ['id'] } }), 'FOREIGN KEY ("id") REFERENCES "test" ("id")')
    })
    test('foreign key ddl references.columns string', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getForeignKeyDdl({ columns: 'id', references: { table: 'test', columns: 'id' } }), 'FOREIGN KEY ("id") REFERENCES "test" ("id")')
    })
    test('create table ddl no columns throws', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getTableDdl('test', {});
        })
    })
    test('create table ddl column', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getTableDdl('test', { columns: { id: { type: 'INTEGER' } } }), 'CREATE TABLE "test" ("id" INTEGER)');
    })
    test('create table ddl column + primary key', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getTableDdl('test', { columns: { id: { type: 'INTEGER' } }, primaryKey: 'id' }),
            'CREATE TABLE "test" ("id" INTEGER, PRIMARY KEY ("id"))');
    })
    test('create table ddl column + foreign key', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getTableDdl('test', { columns: { id: { type: 'INTEGER' } }, foreignKeys: [{ columns: 'id', references: { table: 'test2', columns: 'id' } }] }),
            'CREATE TABLE "test" ("id" INTEGER, FOREIGN KEY ("id") REFERENCES "test2" ("id"))');
    })
})

suite('sqlite apply data def', () => {
    test('create table', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');
        await db.connect();
        const def = {
            tables: {
                test: {
                    columns: {
                        id: { type: 'INTEGER' }
                    }
                }
            }
        }
        await db.applyDataDefinition(def);

        t.assert.strictEqual(await db.tableExists('test'), true)
    })
    test('create table table_info', async (t) => {
        const db = await Dal.getDal('sqlite::memory:');
        await db.connect();
        const def = {
            tables: {
                test: {
                    columns: {
                        id: { type: 'INTEGER' }
                    }
                }
            }
        }
        await db.applyDataDefinition(def);

        const tableInfo = await db.query('PRAGMA table_info([test]);');
        t.assert.equal(tableInfo[0].cid, 0);
        t.assert.equal(tableInfo[0].dflt_value, null);
        t.assert.equal(tableInfo[0].name, 'id');
        t.assert.equal(tableInfo[0].notnull, 0);
        t.assert.equal(tableInfo[0].pk, 0);
        t.assert.equal(tableInfo[0].type, 'INTEGER');
    })
})

suite('quoting', async () => {
    const db = await Dal.getDal('sqlite::memory:');
    test('quote name', (t) => {
        t.assert.strictEqual(db._quoteName('test'), `"test"`);
    })
    test('quote null value', (t) => {
        t.assert.strictEqual(db._quoteValue(null, 'NULL'), 'NULL');
    })
    test('quote true value', (t) => {
        t.assert.strictEqual(db._quoteValue(true, 'NULL'), 'TRUE');
    })
    test('quote false value', (t) => {
        t.assert.strictEqual(db._quoteValue(false, 'NULL'), 'FALSE');
    })
    test('quote INTEGER value', (t) => {
        t.assert.strictEqual(db._quoteValue(1, 'INTEGER'), 1);
    })
    test('quote REAL value', (t) => {
        t.assert.strictEqual(db._quoteValue(1.0, 'REAL'), 1.0);
    })
    test('quote TEXT value', (t) => {
        t.assert.strictEqual(db._quoteValue('test', 'TEXT'), '\'test\'');
    })
    test('quote BLOB value', (t) => {
        t.assert.strictEqual(db._quoteValue('test', 'BLOB'), '\'test\'');
    })
})

suite('data manipulation', async () => {
    const db = await Dal.getDal('sqlite::memory:');
    await db.connect();
    const def = {
        tables: {
            test: {
                columns: {
                    id: { type: 'INTEGER' },
                    name: {type: 'TEXT'}
                }
            }
        }
    }

    beforeEach(async () => {
        await db.applyDataDefinition(def);
    })
    test('get col types', async (t) => {
        t.assert.deepEqual((await db._getColumnTypes('test')), { id: 'INTEGER', name: 'TEXT' });
    })
    test('insert values', async (t) => {
        await db.insert('test', { id: 1, name: 'one' });
        t.assert.deepEqual((await db.query('SELECT * FROM "test"')), [{id:1, name: 'one'}])
    })
    afterEach(async () => {
        await db.exec('DROP TABLE "test"');
    })
})
