var mysql = require("mysql");

const localDBConfig = {
  connectionLimit: 10,
  host: "app.aws.wasin.me",
  user: "vrpapp",
  password: "vrpapp0000",
  database: "app_db",
};

const Database = class {
  constructor(host, username, password, dbname) {
    if (host) localDBConfig.host = host;
    if (username) localDBConfig.user = username;
    if (password) localDBConfig.password = password;
    if (dbname) localDBConfig.database = dbname;
    this.pool = mysql.createPool(localDBConfig);
    console.log("Database Connected!");
  }

  getConfig() {
    return localDBConfig;
  }

  query(sql) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, (err, result, field) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  escape(variable) {
    return this.pool.escape(variable);
  }
};

module.exports = Database;
