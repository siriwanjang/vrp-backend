const mysql = require("mysql");
const db_config = require("../config/modelDb.config");

const db_connection = mysql.createPool({
  host: db_config.HOST,
  user: db_config.USER,
  password: db_config.PASSWORD,
  database: db_config.DB,
});

module.exports.queryData = (date) => {
  return new Promise((resolve, reject) => {
    // console.log(date);
    db_connection.getConnection((err, connection) => {
      if (err) console.error(err);
      //   console.log("MySQL Connection Established: ", connection.threadId);
      connection.query(
        `SELECT route_sum.ORDER_DATE, route_sum.ROUTE_ID, route_sum.TOTAL_DISTANCE_EST, route_sum.TOTAL_TIME_EST ,
            roder.*
        FROM ROUTE_SUMMARY route_sum
        LEFT JOIN ROUTE_ORDER roder ON route_sum.ROUTE_ID = roder.ROUTE_ID
        WHERE route_sum.ORDER_DATE 
            BETWEEN ${connection.escape(date + " 00:00:00")} 
            AND ${connection.escape(date + " 23:59:59")}`,
        (err, results) => {
          if (err) console.error(err);
          // console.log("User Query Results: ", results);
          resolve(results);
          connection.release((err) => {
            if (err) console.error(err);
          });
        }
      );
    });
  });
};

module.exports.queryLocation = (location_id) => {
  return new Promise((resolve, reject) => {
    db_connection.getConnection((err, connection) => {
      if (err) console.error(err);
      //   console.log("MySQL Connection Established: ", connection.threadId);
      connection.query(
        `SELECT CONCAT(PROVINCE,"_",DISTRICT,"_",SUBDISTRICT) AS NAME, TYPE, LAT, \`LONG\` FROM ATM_PROFILE WHERE ATM_ID = ${connection.escape(
          location_id
        )}`,
        (err, results) => {
          if (err) console.error(err);
          // console.log("User Query Results: ", results);
          resolve(results);
          connection.release((err) => {
            if (err) console.error(err);
          });
        }
      );
    });
  });
};
