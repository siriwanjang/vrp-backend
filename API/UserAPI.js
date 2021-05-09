const Util = require("../Utility/Util");

var crypto = require("crypto");
const path = require("path");
const scriptName = path.basename(__filename, ".js");

const users = require("../controller/users.controller");

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

      const res_pass = await users.getPassword(username);
      if (res_pass === null) {
        throw `${scriptName}_userLogin_InvalidUsernamePassword`;
      }
      if (res_pass.password !== pwd_hash) {
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
