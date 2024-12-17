import { suite, test } from 'node:test';
import {access, constants, unlink} from 'node:fs/promises';
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
        await db.exec('CREATE TABLE "config" ("name" TEXT NOT NULL, "value" TEXT NOT NULL, PRIMARY KEY ("name"))');
        await db.close();

        t.assert.strictEqual(await access('./test.sqlite', constants.F_OK), undefined);

        await unlink('./test.sqlite');
    })
    test('table exists', async (t) => {
        let db = await Dal.getDal('sqlite:test.sqlite');
        await db.connect();
        await db.exec('CREATE TABLE "config" ("name" TEXT NOT NULL, "value" TEXT NOT NULL, PRIMARY KEY ("name"))');

        t.assert.strictEqual(await db.tableExists('config'), true);

        await unlink('./test.sqlite');
    })
})
