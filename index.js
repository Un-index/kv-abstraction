
// turn keys to strings before saving !!!!!
require("v8-compile-cache");
const mysql = require("mysql");

/** @namespace */
let obj = {};


/** @namespace */
let _internalDataStoreObject = {};


// db-fiddle.com good place to test out syntax compatible with SQL 8.0
// use webpack.js to bundle scripts?
// logs in to the db - necessary to call this function before executing anything else
// returns DataStore object


/**
 * Note: Detailed documentation exists separately for each method, read that if you want.
 * @typedef {Object} DataStoreObject
 * @property {function} Set - saves a value to the specified key (read the documentation for DataStoreObject.Set)
 * @property {function} Get - retrieves the value associated to the specified key (read the documentation for DataStoreObject.Get)
 * @property {function} GetAsync - essentially DataStoreObject.Get, but asynchronous and returns a promise
 * @property {function} Destroy - ends connection to a database so that you can't read from / write to it
 */


/**
 * creates and returns a DataStore object with the specified configurations
 * @memberof obj
 * @param {string} dataStoreName - specifies the DataStore's name, under the hood this causes an SQL query to create a table with the specified name (that is, if the table doesn't already exist). Note that this is different from the parameter: dbName
 * @param {string} [hostname="localhost"] - specifies the hostname of the MySQL database to connect to; Default: localhost. This hostname is given to you by your DataBase provider; for e.g, when using db4free.net your hostname would be db4free.net
 * @param {string} user - The MySQL user to authenticate as
 * @param {string} pass - The password of the MySQL user specified by the parameter: user
 * @param {string} dbName - The name of the database to use for this connection. Note that this is different from the parameter: dataStoreName
 * @param {string} [portName="3306"] - The port number to user for this connection; Default: 3306
 * @param {boolean} debug - specifies whether to activate debug mode for this connection. Can be true/false or an array of string packet type names that should be printed; Default: false. Packet type names can be either ComQueryPacket, RowDataPacket, COM_QUIT etc.
 * @returns {DataStoreObject} DataStoreObject
 */
let GetDataStore = (
  dataStoreName,
  hostname,
  user,
  pass,
  dbName,
  portName,
  debug
)=>{
  hostname =
    (hostname && typeof hostname === "string" && hostname) || "localhost";
  portName = (portName && portName) || 3306; // should it be a string?

  dbname = dataStoreName || "dat010atest38$unique2_";
  let connection = mysql.createConnection(
    // port default: 3306
    {
      debug: debug, // just switch it to true for debug mode, default: false
      multipleStatements: true,
      host: hostname, // hostname of the database to connect to; default: localhost
      user: user, // user
      password: pass, // password
      database: dbName, // database
      port: portName, // port; default: 3306
    }
  );

  connection.connect((err) => {
    if (err) {
      console.log(`could not connect to database ${dbName}; error: ${err}`);
    }
    return;
  });
  // connection.ping(function (err) {
  //   if (err) throw err;
  //   console.log("Server responded to ping");
  // })

  let init = new Promise((resolve, reject) => {
    for (loop = 0; loop < 5; loop++) {
      connection.query(
        "CREATE TABLE IF NOT EXISTS " +
          dbname +
          " (k char(50), vals text(4000000)); " +
          "CREATE UNIQUE INDEX ind ON " +
          dbname +
          " (k);",
        function (error, results, fields) {
          if (error) {
            if (loop === 4) {
              reject("error");
              throw error;
            } // 4 retries when initiating database in case of failure
          } else {
            console.log((debug && "successfully initiated db") || "");
            resolve("success");
          }
        }
      );
    }
  });

  (async () => {
    let res = await init;
    //console.log("init result: ", res);
  })();

  

  /**
   * saves a value to the specified key
   * @memberof _internalDataStoreObject
   * @param {string} key - the key to associate a value with
   * @param {string} value - the value to associate with the specified key; you can supply any valid Javascript object that can be saved (the value has JSON.stringify called on it internally to return a string before saving - the string can have a maximum of 4,000,000 characters)
   * @example
   * let kv = require("kv-abstraction");
   * let DataStoreObject = kv.GetDataStore("dataStoreName", "hostname", "user", "pass", "dbName", "portName", "debug");
   * DataStoreObject.Set("key", 10);             // valid
   * DataStoreObject.Set("key", "10");           // valid
   * DataStoreObject.Set("key", {a:"1", b:"2"}); // valid
   * @returns {any} value - returns the specified value back
   */
   let Set = (key, value) => {
    value = JSON.stringify(value);

    connection.query(
      // creates a key with value: value, if key doesn't exist it will be created

      "INSERT INTO " +
        dbname +
        " (k, vals) " +
        "VALUES " +
        `("${key}", '${value}') ` +
        "ON DUPLICATE KEY UPDATE " +
        "k     = VALUES(k), " +
        "vals = VALUES(vals);",

      function (error, results, fields) {
        if (error) {
          throw error;
        }
        return value;
      }
    );
  };

  _internalDataStoreObject.Set = Set;
  Set=null; 

  /**
   * retrieves the value associated to the specified key asynchronously
   * @memberof _internalDataStoreObject
   * @param {string} key - the key to retrieve a value for - if the retrieved value was JSON Encoded then it will automatically be parsed into a Javascript object for you
   * @example
   * let kv = require("kv-abstraction");
   * let DataStoreObject = kv.GetDataStore("dataStoreName", "hostname", "user", "pass", "dbName", "portName", "debug");
   * DataStoreObject.Get("key").then((value) => {
   *     console.log("value = " + value)
   * }, (err) => {
   *     console.log(err)
   * });
   * @returns {Promise} value - returns a Promise object that resolves to the value associated with the specified key
   */

    let GetAsync = async (key) => {
    const p = new Promise((resolve, reject) => {
      connection
        .query(
          // retrieves the value associated with the specified key
          "SELECT * FROM " + dbname + " WHERE k =" + connection.escape(key)
        )
        .on("result", function (row) {
          //console.log(`result: ${row.vals}`);  RowDataPacket {k: "a", vals: "2"} (row = RowDataPacket, returns data similar to that shown here)
          let v = row.vals;
          try {
            v = JSON.parse(v);
          } catch {}
          resolve(v);
          v = null;
        })
        .on("error", function (err) {
          reject(`error while retrieving data: ${err}`);
        });
    });
    return await p;
  };
  _internalDataStoreObject.GetAsync=GetAsync;
  GetAsync=null;

  /**
   * callback to be executed once a value is retrieved for a specified key by _internalDataStoreObject.Get
   * @callback GetCallback
   * @param {string} retrievedValue
   * @param {string} errorMessage
   */

  /**
   * retrieves the value associated to the specified key synchronously
   * @memberof _internalDataStoreObject
   * @param {string} key - the key to retrieve a value for - if the retrieved value was JSON Encoded then it will automatically be parsed into a Javascript object for you
   * @param {GetCallback} callback - the callback to pass the retrieved value to - make sure to handle errors as well using the second parameter
   * @example
   * let kv = require("kv-abstraction");
   * let DataStoreObject = kv.GetDataStore("dataStoreName", "hostname", "user", "pass", "dbName", "portName", "debug");
   * DataStoreObject.Get("key", function(value, err) {
   *     if (err) {
   *         console.log("err = "+err)
   *     };
   *     console.log("value = " + value);
   * });
   * @returns {any}
   */

  let Get = (key, callback) => {
    if (typeof callback !== "function") {
      throw new TypeError(
        `expected a function to @param callback, got ${typeof callback}: ${callback}`
      );
    }

    connection
      .query(
        // retrieves the value associated with the specified key
        "SELECT * FROM " + dbname + " WHERE k =" + connection.escape(key)
      )
      .on("result", function (row) {
        //console.log(`result: ${row.vals}`);  RowDataPacket {k: "a", vals: "2"} (row = RowDataPacket, returns data similar to that shown here)
        let v = row.vals;
        try {
          v = JSON.parse(v);
        } catch {}
        callback(v);
      })
      .on("error", function (err) {
        callback(null, `error while retrieving data: ${err}`);
      });
  };
  _internalDataStoreObject.Get=Get;
  Get=null;

  /**
   * ends / kills connection to a database
   * @memberof _internalDataStoreObject
   * @returns {void}
   * @example
   * let kv = require("kv-abstraction");
   * let DataStoreObject = kv.GetDataStore("dataStoreName", "hostname", "user", "pass", "dbName", "portName", "debug");
   * DataStoreObject.Destroy();
   */

  let Destroy = () => {
    connection.end();
  };
  _internalDataStoreObject.Destroy= Destroy;
  Destroy=null;

  return new Object(_internalDataStoreObject); // class /  constructor usage?
};


obj.GetDataStore = GetDataStore;

module.exports = obj;
