## Objects

<dl>
<dt><a href="#obj">obj</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#_internalDataStoreObject">_internalDataStoreObject</a> : <code>object</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#DataStoreObject">DataStoreObject</a> : <code>Object</code></dt>
<dd><p>Note: Detailed documentation exists separately for each method, read that if you want.</p>
</dd>
<dt><a href="#GetCallback">GetCallback</a> : <code>function</code></dt>
<dd><p>callback to be executed once a value is retrieved for a specified key by _internalDataStoreObject.Get</p>
</dd>
</dl>

<a name="obj"></a>

## obj : <code>object</code>
**Kind**: global namespace
<a name="obj.GetDataStore"></a>

### obj.GetDataStore(dataStoreName, [hostname], user, pass, dbName, [portName], debug) ⇒ [<code>DataStoreObject</code>](#DataStoreObject)
creates and returns a DataStore object with the specified configurations

**Kind**: static method of [<code>obj</code>](#obj)
**Returns**: [<code>DataStoreObject</code>](#DataStoreObject) - DataStoreObject

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| dataStoreName | <code>string</code> |  | specifies the DataStore's name, under the hood this causes an SQL query to create a table with the specified name (that is, if the table doesn't already exist). Note that this is different from the parameter: dbName |
| [hostname] | <code>string</code> | <code>"localhost"</code> | specifies the hostname of the MySQL database to connect to; Default: localhost. This hostname is given to you by your DataBase provider; for e.g, when using db4free.net your hostname would be db4free.net |
| user | <code>string</code> |  | The MySQL user to authenticate as |
| pass | <code>string</code> |  | The password of the MySQL user specified by the parameter: user |
| dbName | <code>string</code> |  | The name of the database to use for this connection. Note that this is different from the parameter: dataStoreName |
| [portName] | <code>string</code> | <code>"3306"</code> | The port number to user for this connection; Default: 3306 |
| debug | <code>boolean</code> |  | specifies whether to activate debug mode for this connection. Can be true/false or an array of string packet type names that should be printed; Default: false. Packet type names can be either ComQueryPacket, RowDataPacket, COM_QUIT etc. |

<a name="_internalDataStoreObject"></a>

## \_internalDataStoreObject : <code>object</code>
**Kind**: global namespace

* [_internalDataStoreObject](#_internalDataStoreObject) : <code>object</code>
    * [.Set(key, value)](#_internalDataStoreObject.Set) ⇒ <code>any</code>
    * [.GetAsync(key)](#_internalDataStoreObject.GetAsync) ⇒ <code>Promise</code>
    * [.Get(key, callback)](#_internalDataStoreObject.Get) ⇒ <code>any</code>
    * [.Destroy()](#_internalDataStoreObject.Destroy) ⇒ <code>void</code>

<a name="_internalDataStoreObject.Set"></a>

### _internalDataStoreObject.Set(key, value) ⇒ <code>any</code>
saves a value to the specified key

**Kind**: static method of [<code>\_internalDataStoreObject</code>](#_internalDataStoreObject)
**Returns**: <code>any</code> - value - returns the specified value back

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key to associate a value with |
| value | <code>string</code> | the value to associate with the specified key; you can supply any valid Javascript object that can be saved (the value has JSON.stringify called on it internally to return a string before saving - the string can have a maximum of 4,000,000 characters) |

**Example**
```js
let kv = require("kv-abstraction");
let DataStoreObject = kv.GetDataStore("dataStoreName", "hostname", "user", "pass", "dbName", "portName", "debug");
DataStoreObject.Set("key", 10);             // valid
DataStoreObject.Set("key", "10");           // valid
DataStoreObject.Set("key", {a:"1", b:"2"}); // valid

```
<a name="_internalDataStoreObject.GetAsync"></a>

### _internalDataStoreObject.GetAsync(key) ⇒ <code>Promise</code>
retrieves the value associated to the specified key asynchronously

**Kind**: static method of [<code>\_internalDataStoreObject</code>](#_internalDataStoreObject)
**Returns**: <code>Promise</code> - value - returns a Promise object that resolves to the value associated with the specified key

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key to retrieve a value for - if the retrieved value was JSON Encoded then it will automatically be parsed into a Javascript object for you |

**Example**
```js

let kv = require("kv-abstraction");
let DataStoreObject = kv.GetDataStore("dataStoreName", "hostname", "user", "pass", "dbName", "portName", "debug");
DataStoreObject.Get("key").then((value) => {
    console.log("value = " + value)
}, (err) => {
    console.log(err)
});
```
<a name="_internalDataStoreObject.Get"></a>

### _internalDataStoreObject.Get(key, callback) ⇒ <code>any</code>
retrieves the value associated to the specified key synchronously

**Kind**: static method of [<code>\_internalDataStoreObject</code>](#_internalDataStoreObject)

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | the key to retrieve a value for - if the retrieved value was JSON Encoded then it will automatically be parsed into a Javascript object for you |
| callback | [<code>GetCallback</code>](#GetCallback) | the callback to pass the retrieved value to - make sure to handle errors as well using the second parameter |

**Example**
```js
let kv = require("kv-abstraction");
let DataStoreObject = kv.GetDataStore("dataStoreName", "hostname", "user", "pass", "dbName", "portName", "debug");
DataStoreObject.Get("key", function(value, err) {
    if (err) {
        console.log("err = "+err)
    };
    console.log("value = " + value);
});
```
<a name="_internalDataStoreObject.Destroy"></a>

### _internalDataStoreObject.Destroy() ⇒ <code>void</code>
ends / kills connection to a database

**Kind**: static method of [<code>\_internalDataStoreObject</code>](#_internalDataStoreObject)
**Example**
```js
let kv = require("kv-abstraction");
let DataStoreObject = kv.GetDataStore("dataStoreName", "hostname", "user", "pass", "dbName", "portName", "debug");
DataStoreObject.Destroy();
```
<a name="DataStoreObject"></a>

## DataStoreObject : <code>Object</code>
Note: Detailed documentation exists separately for each method, read that if you want.

**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| Set | <code>function</code> | saves a value to the specified key (read the documentation for DataStoreObject.Set) |
| Get | <code>function</code> | retrieves the value associated to the specified key (read the documentation for DataStoreObject.Get) |
| GetAsync | <code>function</code> | essentially DataStoreObject.Get, but asynchronous and returns a promise |
| Destroy | <code>function</code> | ends connection to a database so that you can't read from / write to it |

<a name="GetCallback"></a>

## GetCallback : <code>function</code>
callback to be executed once a value is retrieved for a specified key by _internalDataStoreObject.Get

**Kind**: global typedef

| Param | Type |
| --- | --- |
| retrievedValue | <code>string</code> |
| errorMessage | <code>string</code> |
