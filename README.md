# dal-lite

## Modules

<dl>
<dt><a href="#module_dals/sqlite3">dals/sqlite3</a></dt>
<dd></dd>
<dt><a href="#module_index">index</a></dt>
<dd></dd>
</dl>

<a name="module_dals/sqlite3"></a>

## dals/sqlite3

* [dals/sqlite3](#module_dals/sqlite3)
    * [~SqliteDal](#module_dals/sqlite3..SqliteDal) ⇐ <code>Dal</code>
        * [.type](#module_dals/sqlite3..SqliteDal+type)
        * [.connect()](#module_dals/sqlite3..SqliteDal+connect)
        * [.tableExists()](#module_dals/sqlite3..SqliteDal+tableExists)
        * [.createTable()](#module_dals/sqlite3..SqliteDal+createTable)
        * [.dropTable()](#module_dals/sqlite3..SqliteDal+dropTable)
        * [.exec()](#module_dals/sqlite3..SqliteDal+exec)
        * [.query()](#module_dals/sqlite3..SqliteDal+query)
        * [.quoteIdentifier()](#module_dals/sqlite3..SqliteDal+quoteIdentifier)
        * [.quoteValue()](#module_dals/sqlite3..SqliteDal+quoteValue)
        * [.insert()](#module_dals/sqlite3..SqliteDal+insert)
        * [.update()](#module_dals/sqlite3..SqliteDal+update)
        * [.select()](#module_dals/sqlite3..SqliteDal+select)
        * [.delete()](#module_dals/sqlite3..SqliteDal+delete)
        * [.close()](#module_dals/sqlite3..SqliteDal+close)

<a name="module_dals/sqlite3..SqliteDal"></a>

### dals/sqlite3~SqliteDal ⇐ <code>Dal</code>
DAL that connects to sqlite3 databases

**Kind**: inner class of [<code>dals/sqlite3</code>](#module_dals/sqlite3)  
**Extends**: <code>Dal</code>  
**See**: Dal  

* [~SqliteDal](#module_dals/sqlite3..SqliteDal) ⇐ <code>Dal</code>
    * [.type](#module_dals/sqlite3..SqliteDal+type)
    * [.connect()](#module_dals/sqlite3..SqliteDal+connect)
    * [.tableExists()](#module_dals/sqlite3..SqliteDal+tableExists)
    * [.createTable()](#module_dals/sqlite3..SqliteDal+createTable)
    * [.dropTable()](#module_dals/sqlite3..SqliteDal+dropTable)
    * [.exec()](#module_dals/sqlite3..SqliteDal+exec)
    * [.query()](#module_dals/sqlite3..SqliteDal+query)
    * [.quoteIdentifier()](#module_dals/sqlite3..SqliteDal+quoteIdentifier)
    * [.quoteValue()](#module_dals/sqlite3..SqliteDal+quoteValue)
    * [.insert()](#module_dals/sqlite3..SqliteDal+insert)
    * [.update()](#module_dals/sqlite3..SqliteDal+update)
    * [.select()](#module_dals/sqlite3..SqliteDal+select)
    * [.delete()](#module_dals/sqlite3..SqliteDal+delete)
    * [.close()](#module_dals/sqlite3..SqliteDal+close)

<a name="module_dals/sqlite3..SqliteDal+type"></a>

#### sqliteDal.type
**Kind**: instance property of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.type  
<a name="module_dals/sqlite3..SqliteDal+connect"></a>

#### sqliteDal.connect()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.connect  
<a name="module_dals/sqlite3..SqliteDal+tableExists"></a>

#### sqliteDal.tableExists()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.tableExists  
<a name="module_dals/sqlite3..SqliteDal+createTable"></a>

#### sqliteDal.createTable()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.createTable  
<a name="module_dals/sqlite3..SqliteDal+dropTable"></a>

#### sqliteDal.dropTable()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.dropTable  
<a name="module_dals/sqlite3..SqliteDal+exec"></a>

#### sqliteDal.exec()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.exec  
<a name="module_dals/sqlite3..SqliteDal+query"></a>

#### sqliteDal.query()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.query  
<a name="module_dals/sqlite3..SqliteDal+quoteIdentifier"></a>

#### sqliteDal.quoteIdentifier()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.quoteIdentifier  
<a name="module_dals/sqlite3..SqliteDal+quoteValue"></a>

#### sqliteDal.quoteValue()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.quoteValue  
<a name="module_dals/sqlite3..SqliteDal+insert"></a>

#### sqliteDal.insert()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.insert  
<a name="module_dals/sqlite3..SqliteDal+update"></a>

#### sqliteDal.update()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.update  
<a name="module_dals/sqlite3..SqliteDal+select"></a>

#### sqliteDal.select()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.select  
<a name="module_dals/sqlite3..SqliteDal+delete"></a>

#### sqliteDal.delete()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.delete  
<a name="module_dals/sqlite3..SqliteDal+close"></a>

#### sqliteDal.close()
**Kind**: instance method of [<code>SqliteDal</code>](#module_dals/sqlite3..SqliteDal)  
**See**: Dal.close  
<a name="module_index"></a>

## index

* [index](#module_index)
    * [~Dal](#module_index..Dal)
        * [new Dal(uri, [_options])](#new_module_index..Dal_new)
        * _instance_
            * *[.type](#module_index..Dal+type) ⇒ <code>string</code>*
            * *[.connect([_options])](#module_index..Dal+connect) ⇒ <code>Promise</code>*
            * *[.tableExists(table, [_options])](#module_index..Dal+tableExists) ⇒ <code>Promise</code>*
            * *[.createTable(table, tableDef, [_options])](#module_index..Dal+createTable) ⇒ <code>Promise</code>*
            * *[.alterTable(table, defChanges, [_options])](#module_index..Dal+alterTable) ⇒ <code>Promise</code>*
            * *[.dropTable(table, [_options])](#module_index..Dal+dropTable) ⇒ <code>Promise</code>*
            * *[.quoteIdentifier(name, [_options])](#module_index..Dal+quoteIdentifier) ⇒ <code>string</code>*
            * *[.quoteValue(value, type, [_options])](#module_index..Dal+quoteValue) ⇒ <code>string</code>*
            * *[.exec(sql, [_options])](#module_index..Dal+exec) ⇒ <code>Promise</code>*
            * *[.query(sql, [_options])](#module_index..Dal+query) ⇒ <code>Promise</code>*
            * *[.insert(into, values, [_options])](#module_index..Dal+insert) ⇒ <code>Promise</code>*
            * *[.update(table, changes, [_options])](#module_index..Dal+update) ⇒ <code>Promise</code>*
            * *[.select(columns, from, [_options])](#module_index..Dal+select) ⇒ <code>Promise</code>*
            * *[.delete(from, [_options])](#module_index..Dal+delete) ⇒ <code>Promise</code>*
            * [.applyDataDefinition(def, [_options])](#module_index..Dal+applyDataDefinition) ⇒ <code>Promise</code>
            * *[.close()](#module_index..Dal+close) ⇒ <code>Promise</code>*
        * _static_
            * [.getDal(uri, [_options])](#module_index..Dal.getDal) ⇒ <code>Dal</code>
    * [~TableSpec](#module_index..TableSpec) : <code>string</code> \| <code>object</code> \| <code>Array.&lt;string&gt;</code>
    * [~ColumnDef](#module_index..ColumnDef) : <code>object</code>
    * [~PrimaryKeyDef](#module_index..PrimaryKeyDef) : <code>string</code> \| <code>Array.&lt;string&gt;</code>
    * [~ForeignKeyDef](#module_index..ForeignKeyDef) : <code>object</code>
    * [~TableDef](#module_index..TableDef) : <code>object</code>
    * [~IndexDef](#module_index..IndexDef) : <code>object</code>
    * [~ViewDef](#module_index..ViewDef) : <code>object</code>
    * [~DataDef](#module_index..DataDef) : <code>object</code>
    * [~ChangeDef](#module_index..ChangeDef) : <code>object</code>

<a name="module_index..Dal"></a>

### index~Dal
Abstract class that selects a DAL for a given connection string (URI) via @function getDal

**Kind**: inner class of [<code>index</code>](#module_index)  

* [~Dal](#module_index..Dal)
    * [new Dal(uri, [_options])](#new_module_index..Dal_new)
    * _instance_
        * *[.type](#module_index..Dal+type) ⇒ <code>string</code>*
        * *[.connect([_options])](#module_index..Dal+connect) ⇒ <code>Promise</code>*
        * *[.tableExists(table, [_options])](#module_index..Dal+tableExists) ⇒ <code>Promise</code>*
        * *[.createTable(table, tableDef, [_options])](#module_index..Dal+createTable) ⇒ <code>Promise</code>*
        * *[.alterTable(table, defChanges, [_options])](#module_index..Dal+alterTable) ⇒ <code>Promise</code>*
        * *[.dropTable(table, [_options])](#module_index..Dal+dropTable) ⇒ <code>Promise</code>*
        * *[.quoteIdentifier(name, [_options])](#module_index..Dal+quoteIdentifier) ⇒ <code>string</code>*
        * *[.quoteValue(value, type, [_options])](#module_index..Dal+quoteValue) ⇒ <code>string</code>*
        * *[.exec(sql, [_options])](#module_index..Dal+exec) ⇒ <code>Promise</code>*
        * *[.query(sql, [_options])](#module_index..Dal+query) ⇒ <code>Promise</code>*
        * *[.insert(into, values, [_options])](#module_index..Dal+insert) ⇒ <code>Promise</code>*
        * *[.update(table, changes, [_options])](#module_index..Dal+update) ⇒ <code>Promise</code>*
        * *[.select(columns, from, [_options])](#module_index..Dal+select) ⇒ <code>Promise</code>*
        * *[.delete(from, [_options])](#module_index..Dal+delete) ⇒ <code>Promise</code>*
        * [.applyDataDefinition(def, [_options])](#module_index..Dal+applyDataDefinition) ⇒ <code>Promise</code>
        * *[.close()](#module_index..Dal+close) ⇒ <code>Promise</code>*
    * _static_
        * [.getDal(uri, [_options])](#module_index..Dal.getDal) ⇒ <code>Dal</code>

<a name="new_module_index..Dal_new"></a>

#### new Dal(uri, [_options])

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | Connection string used to attach to the database |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+type"></a>

#### *dal.type ⇒ <code>string</code>*
Gets the underlying DAL type of this DAL

**Kind**: instance abstract property of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>string</code> - The underlying DAL type  
<a name="module_index..Dal+connect"></a>

#### *dal.connect([_options]) ⇒ <code>Promise</code>*
Connects the specified database. This is only necessary if you specified connect=false in the options to getDal

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  

| Param | Type | Description |
| --- | --- | --- |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+tableExists"></a>

#### *dal.tableExists(table, [_options]) ⇒ <code>Promise</code>*
Checks if a table exists

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  

| Param | Type | Description |
| --- | --- | --- |
| table | <code>TableSpec</code> | Table specifier |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+createTable"></a>

#### *dal.createTable(table, tableDef, [_options]) ⇒ <code>Promise</code>*
Creates a table from a given table definition

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  

| Param | Type | Description |
| --- | --- | --- |
| table | <code>TableSpec</code> | Table specifier [TableSpec](TableSpec) |
| tableDef | <code>TableDef</code> | Table definition |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+alterTable"></a>

#### *dal.alterTable(table, defChanges, [_options]) ⇒ <code>Promise</code>*
Alters an existing table to match a given table definition

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Promise</code> - Promise that resolves when table is altered or rejects for errors  

| Param | Type | Description |
| --- | --- | --- |
| table | <code>TableSpec</code> | Table specifier |
| defChanges | <code>object</code> | Changes to apply to table |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+dropTable"></a>

#### *dal.dropTable(table, [_options]) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Promise</code> - Promise that resolves for successful table drop or rejects for errors  

| Param | Type | Description |
| --- | --- | --- |
| table | <code>TableSpec</code> | Table specifier |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+quoteIdentifier"></a>

#### *dal.quoteIdentifier(name, [_options]) ⇒ <code>string</code>*
Quotes a given identifier (e.g. table, column name)

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>string</code> - Quoted name  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+quoteValue"></a>

#### *dal.quoteValue(value, type, [_options]) ⇒ <code>string</code>*
Quotes a given value according to a specified type

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>string</code> - Quoted value  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> |  |
| type | <code>string</code> |  |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+exec"></a>

#### *dal.exec(sql, [_options]) ⇒ <code>Promise</code>*
Executes a given SQL query that does not return data

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Promise</code> - Promise that will resolve with no data or reject  

| Param | Type | Description |
| --- | --- | --- |
| sql | <code>string</code> | The query |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+query"></a>

#### *dal.query(sql, [_options]) ⇒ <code>Promise</code>*
Run a query that returns data from the database.

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Promise</code> - Promise that resolves with data or rejects  

| Param | Type | Description |
| --- | --- | --- |
| sql | <code>string</code> | The query |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+insert"></a>

#### *dal.insert(into, values, [_options]) ⇒ <code>Promise</code>*
Insert data into the database.

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Promise</code> - Promise that resolves for a successful insert or rejects  

| Param | Type | Description |
| --- | --- | --- |
| into | <code>TableSpec</code> | Table specifier |
| values | <code>object</code> \| <code>Array.&lt;object&gt;</code> | Array or singular column to value map (object where keys are the column name and the values are the values for the column). |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+update"></a>

#### *dal.update(table, changes, [_options]) ⇒ <code>Promise</code>*
Update data within the database.

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Promise</code> - Promise that resolves for a successful update or rejects  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| table | <code>TableSpec</code> |  | Table specifier |
| changes | <code>Array.&lt;ChangeDef&gt;</code> |  |  |
| [_options] | <code>object</code> | <code></code> | Options |
| _options.where | <code>string</code> |  | Where clause |

<a name="module_index..Dal+select"></a>

#### *dal.select(columns, from, [_options]) ⇒ <code>Promise</code>*
Select data from the database

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Promise</code> - Promise that resolves with returned data or rejects  

| Param | Type | Description |
| --- | --- | --- |
| columns | <code>Array.&lt;string&gt;</code> |  |
| from | <code>TableSpec</code> | Table specifier |
| [_options] | <code>object</code> | Options |
| _options.where | <code>string</code> | Where clause |
| _options.groupBy | <code>string</code> | Group by clause |
| _options.orderBy | <code>string</code> | Order by clause |
| _options.limit.limit | <code>number</code> | Limit results to this value |
| _options.limit.offset | <code>number</code> | Offset results by this value |

<a name="module_index..Dal+delete"></a>

#### *dal.delete(from, [_options]) ⇒ <code>Promise</code>*
Delete data from the database.

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Promise</code> - Promise that resolves with a successful delete or rejects  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>TableSpec</code> | Table specifier TODO joins, etc. |
| [_options] | <code>object</code> | Options |
| _options.where | <code>string</code> | Where clause |

<a name="module_index..Dal+applyDataDefinition"></a>

#### dal.applyDataDefinition(def, [_options]) ⇒ <code>Promise</code>
Uses a DataDef to specify a desired database schema state.

**Kind**: instance method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Promise</code> - Promise that resolves for successful application or rejects  

| Param | Type | Description |
| --- | --- | --- |
| def | <code>DataDef</code> | DataDef describing the expected state of the database |
| [_options] | <code>object</code> | Options |

<a name="module_index..Dal+close"></a>

#### *dal.close() ⇒ <code>Promise</code>*
Closes the connection to the database. The instance should not be used after this.

**Kind**: instance abstract method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Promise</code> - Promise that resolves when the connection is closed or rejects for errors  
<a name="module_index..Dal.getDal"></a>

#### Dal.getDal(uri, [_options]) ⇒ <code>Dal</code>
Given a connection string (URI) chooses a matching subclass of Dal that implements that database dialect and instantiates it

**Kind**: static method of [<code>Dal</code>](#module_index..Dal)  
**Returns**: <code>Dal</code> - The subclass of Dal for the database type specified by the uri  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | Connection string/URI |
| [_options] | <code>object</code> | Options |
| [_options.connect] | <code>boolean</code> | Auto-connect to the database. Defaults to true. |

<a name="module_index..TableSpec"></a>

### index~TableSpec : <code>string</code> \| <code>object</code> \| <code>Array.&lt;string&gt;</code>
Table specifier. Can be a string, an array or an object.
If a string, the simple (no schema) name of the table.
If an array, it must have a length of 2; the first element is the schema, the second element is the table name.
If an object, it must have a property tableName that is the name of the table and an optional property schema that is the name of the schema.

**Kind**: inner typedef of [<code>index</code>](#module_index)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| table | <code>string</code> | The table name |
| schema | <code>string</code> | The table schema |

<a name="module_index..ColumnDef"></a>

### index~ColumnDef : <code>object</code>
Column definition.

**Kind**: inner typedef of [<code>index</code>](#module_index)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | Type of the column (based on types compatible with underlying DAL) |
| [notNull] | <code>boolean</code> | True if column can contain NULL values. Defaults to false. |

<a name="module_index..PrimaryKeyDef"></a>

### index~PrimaryKeyDef : <code>string</code> \| <code>Array.&lt;string&gt;</code>
Primary key definition. Can be a column name or an array of column names.

**Kind**: inner typedef of [<code>index</code>](#module_index)  
<a name="module_index..ForeignKeyDef"></a>

### index~ForeignKeyDef : <code>object</code>
Foreign key definition.

**Kind**: inner typedef of [<code>index</code>](#module_index)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| columns | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Array of column names or string of a singular column name |
| references | <code>object</code> | Definition of the target the column references. |
| references.table | <code>string</code> | Name of the table referenced. |
| references.columns | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Names of the columns or singular name referenced by this foreign key. Should match up with .columns |

<a name="module_index..TableDef"></a>

### index~TableDef : <code>object</code>
Table definition.

**Kind**: inner typedef of [<code>index</code>](#module_index)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| columns | <code>Object.&lt;string, ColumnDef&gt;</code> | Object keyed with column names mapping to ColumnDefs |
| [primaryKey] | <code>PrimaryKeyDef</code> | Primary key definition |
| [foreignKeys] | <code>Array.&lt;ForeignKeyDef&gt;</code> | Definitions of foreign keys within the table |

<a name="module_index..IndexDef"></a>

### index~IndexDef : <code>object</code>
Index definition.

**Kind**: inner typedef of [<code>index</code>](#module_index)  
<a name="module_index..ViewDef"></a>

### index~ViewDef : <code>object</code>
View definition.

**Kind**: inner typedef of [<code>index</code>](#module_index)  
<a name="module_index..DataDef"></a>

### index~DataDef : <code>object</code>
Database schema definition.

**Kind**: inner typedef of [<code>index</code>](#module_index)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tables | <code>Array.&lt;TableDef&gt;</code> | The individual TableDefs |
| indexes | <code>Array.&lt;IndexDef&gt;</code> | The individual IndexDefs |
| views | <code>Array.&lt;ViewDef&gt;</code> | The individual ViewDefs |

<a name="module_index..ChangeDef"></a>

### index~ChangeDef : <code>object</code>
Change to apply to a table's data

**Kind**: inner typedef of [<code>index</code>](#module_index)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| column | <code>string</code> | The column to update |
| value | <code>\*</code> | The new value of the column |

