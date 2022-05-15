const db = require("./connection");
const ctable = require("console.table");

//pass in query objects that contain sql statment and parameters
function Query(queryObj) {
  return new Promise((resolve, reject) => {
    db.query(queryObj.sql, queryObj.params, (err, results) => {
      resolve(console.table(results));
    });
  });
}

function QueryReturnResults(queryObj) {
  return new Promise((resolve, reject) => {
    db.query(queryObj.sql, queryObj.params, (err, results) => {
      resolve(results);
    });
  });
}

module.exports = { Query, QueryReturnResults };
