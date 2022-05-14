const db = require("./connection");
const ctable = require("console.table");

function Query(queryObj) {
  return new Promise((resolve, reject) => {
    db.query(queryObj.sql, queryObj.params, (err, results) => {
      resolve(console.table(results));
    });
  });
}

module.exports = Query;
