const Util = require("../Utility/Util");

var crypto = require("crypto");
const path = require("path");
const scriptName = path.basename(__filename, ".js");

const Database = require("../connections/Database");

let std_ret = {
  status: { success: false, description: "" },
  data: null,
};

module.exports = {
  userLogin: async (data, callback) => {
    const ret_data = { ...std_ret };
    // console.log(data);
    const username = data.username;
    const password = data.password;
    try {
      if (!Util.isValid(username, "varchar", false)) {
        throw `${scriptName}_userLogin_InvalidInputUsername`;
      }
      if (!Util.isValid(password, "varchar", false)) {
        throw `${scriptName}_userLogin_InvalidInputPassword`;
      }
      const pwd_hash = crypto.createHash("sha256").update(password).digest("hex");

      const dbOrigin = new Database();
      const sql_select = "SELECT *";
      const sql_from = " FROM users";
      let sql_where = " WHERE 1 = 1";
      sql_where += ` AND username = ${dbOrigin.escape(username)}`;
      const result = await dbOrigin.query(sql_select + sql_from + sql_where);
      if (result.length < 1) {
        throw `${scriptName}_userLogin_InvalidUsernamePassword`;
      }
      if (pwd_hash !== result[0].password) {
        throw `${scriptName}_userLogin_InvalidUsernamePassword`;
      }

      ret_data.status.success = true;
      ret_data.status.description = `${scriptName}_Success`;
    } catch (err) {
      ret_data.status.success = false;
      ret_data.status.description = scriptName + err;
      ret_data.data = null;
      // console.log(typeof err.stack);
      if (err.stack !== undefined) {
        ret_data.description = err.stack;
      }
      // console.log(ret_data);
    }
    callback(ret_data);
  },
};
