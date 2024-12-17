import { suite, test } from 'node:test';
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
        let db = await Dal.getDal('sqlite:test.sqlite');
        await db.connect();
        await db.close();

        t.assert.strictEqual(await access('./test.sqlite', constants.F_OK), undefined);

        await unlink('./test.sqlite');
    })
    test('exec & table exists', async (t) => {
        let db = await Dal.getDal('sqlite:test.sqlite');
        await db.connect();
        await db.exec('CREATE TABLE "config" ("name" TEXT NOT NULL, "value" TEXT NOT NULL, PRIMARY KEY ("name"))');

        t.assert.strictEqual(await db.tableExists('config'), true);

        await db.close();
        await unlink('./test.sqlite');
    })
    test('create table', async (t) => {
        let db = await Dal.getDal('sqlite:test.sqlite');
        await db.connect();
        await db.createTable('test', { columns: {id: {type: 'INTEGER'}} });

        t.assert.strictEqual(await db.tableExists('test'), true);

        await db.close();
        await unlink('./test.sqlite');
    })
})

suite('sqlite3 ddl', async () => {
    test('column ddl valid types', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getColumnDdl('test', { type: "NULL" }), '"test" NULL')
        t.assert.strictEqual(db._getColumnDdl('test', { type: "INTEGER" }), '"test" INTEGER')
        t.assert.strictEqual(db._getColumnDdl('test', { type: "REAL" }), '"test" REAL')
        t.assert.strictEqual(db._getColumnDdl('test', { type: "TEXT" }), '"test" TEXT')
        t.assert.strictEqual(db._getColumnDdl('test', { type: "BLOB" }), '"test" BLOB')
    })
    test('column ddl invalid types', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getColumnDdl('test', { type: "derp" })
        })
    })
    test('column ddl not null true', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getColumnDdl('test', { type: "INTEGER", notNull: true }), '"test" INTEGER NOT NULL')
    })
    test('primary key ddl column array', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getPrimaryKeyDdl(['id']), 'PRIMARY KEY ("id")')
    })
    test('primary key ddl column string', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getPrimaryKeyDdl('id'), 'PRIMARY KEY ("id")')
    })
    test('foreign key ddl throws for undef columns', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getForeignKeyDdl({ references: 'test' })
        })
    })
    test('foreign key ddl throws for undef references', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getForeignKeyDdl({ columns: ['id'] })
        })
    })
    test('foreign key ddl throws for undef references.table', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getForeignKeyDdl({ columns: ['id'], references: { columns: ['id'] } })
        })
    })
    test('foreign key ddl throws for undef references.columns', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getForeignKeyDdl({ columns: ['id'], references: { table: 'test' } })
        })
    })
    test('foreign key ddl columns array', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getForeignKeyDdl({ columns: ['id'], references: { table: 'test', columns: ['id'] } }), 'FOREIGN KEY ("id") REFERENCES "test" ("id")')
    })
    test('foreign key ddl columns string', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getForeignKeyDdl({ columns: 'id', references: { table: 'test', columns: ['id'] } }), 'FOREIGN KEY ("id") REFERENCES "test" ("id")')
    })
    test('foreign key ddl references.columns array', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getForeignKeyDdl({ columns: ['id'], references: { table: 'test', columns: ['id'] } }), 'FOREIGN KEY ("id") REFERENCES "test" ("id")')
    })
    test('foreign key ddl references.columns string', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getForeignKeyDdl({ columns: 'id', references: { table: 'test', columns: 'id' } }), 'FOREIGN KEY ("id") REFERENCES "test" ("id")')
    })
    test('create table ddl no columns throws', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.throws(() => {
            db._getTableDdl('test', {});
        })
    })
    test('create table ddl column', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getTableDdl('test', { columns: { id: { type: 'INTEGER' } } }), 'CREATE TABLE "test" ("id" INTEGER)');
    })
    test('create table ddl column + primary key', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getTableDdl('test', { columns: { id: { type: 'INTEGER' } }, primaryKey: 'id'}),
            'CREATE TABLE "test" ("id" INTEGER, PRIMARY KEY ("id"))');
    })
    test('create table ddl column + foreign key', async (t) => {
        let db = await Dal.getDal('sqlite::memory:');

        t.assert.strictEqual(db._getTableDdl('test', { columns: { id: { type: 'INTEGER' } }, foreignKeys: [{columns: 'id', references: {table:'test2', columns:'id'}}] }),
            'CREATE TABLE "test" ("id" INTEGER, FOREIGN KEY ("id") REFERENCES "test2" ("id"))');
    })
})
