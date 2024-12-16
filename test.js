import { suite, test } from 'node:test';
import {access, constants} from 'node:fs/promises';
import Dal from "./index.js";
import SqliteDal from './dals/sqlite3.js';

suite('sqlite3 in-memory', async () => {
    test('sqlite dal from sqlite3::memory:', async (t) => {
        const db = await Dal.getDal('sqlite3::memory:');

        t.assert.strictEqual(db.constructor.name, "SqliteDal");
    })
});

suite('sqlite3 file', async () => {
    test('non-existent file creation', async (t) => {
        let db = await Dal.getDal('sqlite3:./test.sqlite3');
        await db.connect();
        await db.exec('CREATE TABLE "config" ("name" TEXT NOT NULL, "value" TEXT NOT NULL, PRIMARY KEY ("name"))');
        await db.close();

        t.assert(await access('./test.sqlite3', constants.F_OK), true);
    })

})
