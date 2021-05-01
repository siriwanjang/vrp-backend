var mysql = require("mysql");

// const localDBConfig = {
//   connectionLimit: 10,
//   host: process.env.DATABASE_ENDPOINT || "localhost",
//   user: process.env.DATABASE_USER || "root",
//   password: process.env.DATABASE_PASSWORD || "",
//   database: "vrp_project",
// };
const localDBConfig = {
  connectionLimit: 10,
  host: "app.aws.wasin.me",
  user: "vrpapp",
  password: "vrpapp0000",
  database: "app_db",
};

let conn = null;

module.exports = {
  dbConnect: () => {
    return new Promise((resolve, reject) => {
      conn = mysql.createPool(localDBConfig);
      console.log("Database Connected!");
    });
  },
  query: (sql, callback) => {
    conn.query(sql, (err, result, field) => {
      callback(err, result, field);
    });
  },
};
