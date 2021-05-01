const Util = require("../Utility/Util");
var path = require("path");
var scriptName = path.basename(__filename, ".js");

let std_ret = {
  success: false,
  description: "",
  data: null,
};

module.exports = {
  testMethod: (data, callback) => {
    const ret_data = { ...std_ret };
    try {
      ret_data.success = true;
      ret_data.description = "Success_process";
      ret_data.data = [1, 2, 3, 4, 5];
      callback(ret_data);
      // throw "test err";
    } catch (err) {
      ret_data.success = false;
      ret_data.description = err;
      ret_data.data = null;
      // console.log(typeof err.stack);
      if (err.stack !== undefined) {
        ret_data.description = err.stack;
      }
      // console.log(ret_data);
      callback(ret_data);
    }
  },
  modelPlaceOrder: (data, callback) => {
    const ret_data = { ...std_ret };

    const node_num = data.node_num;
    const distance = data.distance;
    const estimate_time = data.estimate_time;

    try {
      if (!Util.isValid(node_num, "number", false)) {
        throw "OrderAPI_modelPlaceOrder_InvalidInputNodeNum";
      }
      if (!Util.isValid(distance, "number", false)) {
        throw "OrderAPI_modelPlaceOrder_InvalidInputDistance";
      }
      if (!Util.isValid(estimate_time, "number", false)) {
        throw "OrderAPI_modelPlaceOrder_InvalidInputEstimateTime";
      }
      const order_id = Util.getDateTime().split(" ")[0].replace(/-/g, "") + "01";
      // node_num
      // distance
      // estimate_time
      const create_date = Util.getDateTime();
      const status = "1";

      const insert_obj = {
        order_id: order_id,
        node_num: node_num,
        distance: distance,
        estimate_time: estimate_time,
        create_date: create_date,
        status: status,
      };
      console.log("Insert => ", insert_obj);

      ret_data.success = true;
      ret_data.description = "OrderAPI_modelPlaceOrder_Success";
      // ret_data.data = null;
      callback(ret_data);
    } catch (err) {
      ret_data.success = false;
      ret_data.description = err;
      ret_data.data = null;
      // console.log(typeof err.stack);
      if (err.stack !== undefined) {
        ret_data.description = err.stack;
      }
      // console.log(ret_data);
      callback(ret_data);
    }
  },
};
