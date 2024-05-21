var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = require("./../../env.js");

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.log("cannot open db");
        console.log(err);
    } else {
        console.log("connected");
    }
});

module.exports = db;
