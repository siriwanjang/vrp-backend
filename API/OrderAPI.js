const Util = require("../Utility/Util");
var path = require("path");
var scriptName = path.basename(__filename, ".js");

const Database = require("../connections/Database");

let std_ret = {
  status: {
    success: false,
    description: "",
  },
  data: null,
};

module.exports = {
  modelCreateOrder: async (data, callback) => {
    const ret_data = { ...std_ret };

    const node_num = data.node_num;
    const distance = data.distance;
    const estimate_time = data.estimate_time;
    const node_list = data.node_list;

    try {
      if (!Util.isValid(node_num, "number", false)) {
        throw `${scriptName}_modelCreateOrder_InvalidInputNodeNum`;
      }
      if (!Util.isValid(distance, "number", false)) {
        throw `${scriptName}_modelCreateOrder_InvalidInputDistance`;
      }
      if (!Util.isValid(estimate_time, "number", false)) {
        throw `${scriptName}_modelCreateOrder_InvalidInputEstimateTime`;
      }
      if (!Util.isValid(node_list, "list", false)) {
        throw `${scriptName}_modelCreateOrder_InvalidInputNodeList`;
      }

      const dbOrigin = new Database();
      // check array equal nodenum
      if (node_list.length !== node_num) {
        throw `${scriptName}_modelCreateOrder_NodeListNotEqualNodeNum`;
      }
      // check each node_list is exist on database
      const location_id_list = [];
      for (let e_node of node_list) {
        const sql_select = "SELECT *";
        const sql_from = " FROM location";
        let sql_where = " WHERE 1 = 1";
        sql_where += ` AND location_lat = ${dbOrigin.escape(e_node.lat)}`;
        sql_where += ` AND location_long = ${dbOrigin.escape(e_node.long)}`;

        let result = await dbOrigin.query(sql_select + sql_from + sql_where);
        if (result.length < 1) {
          const sql_insert = "INSERT INTO location (location_name,location_lat, location_long)";
          const sql_values = ` VALUE (
                                ${dbOrigin.escape(e_node.location_name)},
                                ${dbOrigin.escape(e_node.lat)},
                                ${dbOrigin.escape(e_node.long)}
                              )`;
          const insert_result = await dbOrigin.query(sql_insert + sql_values);
          if (!insert_result) {
            throw `${scriptName}_modelCreateOrder_ErrorInsertLocation`;
          }
          result = await dbOrigin.query(sql_select + sql_from + sql_where);
        }
        location_id_list.push({ location_seq: e_node.seq, location_id: result[0].location_id });
      }

      // create order

      let order_id = Util.getDateTime().split(" ")[0].replace(/-/g, "");
      let result_for_id;
      let suffix_id = 0;
      do {
        const sql_select = "SELECT *";
        const sql_from = " FROM orders";
        let sql_where = " WHERE 1=1";
        sql_where += ` AND order_id = ${dbOrigin.escape(
          order_id + Util.zeroPadding(2, ++suffix_id)
        )}`;
        result_for_id = await dbOrigin.query(sql_select + sql_from + sql_where);

        // console.log(sql_select + sql_from + sql_where);
      } while (result_for_id.length > 0);
      order_id += Util.zeroPadding(2, suffix_id);
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
      // console.log("Insert => ", insert_obj);
      const sql_insert1 =
        "INSERT INTO orders (order_id, node_num, distance, estimate_time, create_date, status)";
      const sql_values1 = ` VALUE (
                            ${dbOrigin.escape(insert_obj.order_id)},
                            ${dbOrigin.escape(insert_obj.node_num)},
                            ${dbOrigin.escape(insert_obj.distance)},
                            ${dbOrigin.escape(insert_obj.estimate_time)},
                            ${dbOrigin.escape(insert_obj.create_date)},
                            ${dbOrigin.escape(insert_obj.status)}
                          )`;
      const insert_result1 = await dbOrigin.query(sql_insert1 + sql_values1);
      if (!insert_result1) {
        throw `${scriptName}_modelCreateOrder_ErrorInsertOrder`;
      }

      // insert location_sequence
      const sql_insert2 = "INSERT INTO location_sequence (sequence, order_id, location_id)";
      let sql_values2 = `VALUES `;
      for (let e_location_id_list of location_id_list) {
        sql_values2 += `(
          ${dbOrigin.escape(e_location_id_list.location_seq)},
          ${dbOrigin.escape(insert_obj.order_id)},
          ${dbOrigin.escape(e_location_id_list.location_id)}
        ),`;
      }
      sql_values2 = sql_values2.slice(0, -1);
      const insert_result2 = await dbOrigin.query(sql_insert2 + sql_values2);
      if (!insert_result2) {
        throw `${scriptName}_modelCreateOrder_ErrorInsertLocationSeq`;
      }

      ret_data.status.success = true;
      ret_data.status.description = `${scriptName}_modelCreateOrder_Success`;
      // ret_data.data = null;
      callback(ret_data);
    } catch (err) {
      ret_data.status.success = false;
      ret_data.status.description = err;
      ret_data.data = null;
      // console.log(typeof err.stack);
      if (err.stack !== undefined) {
        ret_data.description = err.stack;
      }
      // console.log(ret_data);
      callback(ret_data);
    }
  },
  userGetOrderList: async (data, callback) => {
    const ret_data = { ...std_ret };
    try {
      const dbOrigin = new Database();
      const sql_select = "SELECT *";
      const sql_from = " FROM orders";
      // where time range
      // let sql_where = " WHERE 1=1";
      const result = await dbOrigin.query(sql_select + sql_from);
      if (result.length < 1) {
        throw `${scriptName}_userGetOrderList_OrderNotFound`;
      }
      const order = [];
      const deli_order = [];

      for (let e_order of result) {
        const order_id = e_order.order_id;
        // console.log(order_id);

        // query location sequence
        const sql_select = "SELECT *";
        let sql_from = " FROM location_sequence lseq";
        sql_from += " LEFT JOIN location loc ON lseq.location_id = loc.location_id";
        let sql_where = " WHERE 1=1";
        sql_where += ` AND order_id = ${dbOrigin.escape(order_id)}`;

        const loc_seq_result = await dbOrigin.query(sql_select + sql_from + sql_where);
        // console.log(loc_seq_result);

        e_order.location_list = loc_seq_result;

        // console.log(e_order);
        const assignee_id = e_order.assignee_id;
        if (assignee_id === null) {
          order.push(e_order);
        } else {
          deli_order.push(e_order);
        }
      }

      ret_data.status.success = true;
      ret_data.status.description = `${scriptName}_userGetOrderList_Success`;
      ret_data.data = { order: order, deli_order: deli_order };
      callback(ret_data);
    } catch (err) {
      ret_data.status.success = false;
      ret_data.status.description = err;
      ret_data.data = null;
      // console.log(typeof err.stack);
      if (err.stack !== undefined) {
        ret_data.description = err.stack;
      }
      // console.log(ret_data);
      callback(ret_data);
    }
  },
  userGetOrderInfo: async (data, callback) => {
    const ret_data = { ...std_ret };

    const order_id = data.order_id;
    try {
      if (!Util.isValid(order_id, "varchar", false)) {
        throw `${scriptName}_modelCreateOrder_InvalidInputOrderId`;
      }
      const dbOrigin = new Database();
      const sql_order_by_id = `SELECT * FROM orders WHERE order_id = ${dbOrigin.escape(order_id)}`;
      const result = await dbOrigin.query(sql_order_by_id);
      if (result.length < 1) {
        throw `${scriptName}_userGetOrderInfo_OrderNotFound`;
      }
      // const order_id = result[0].order_id;

      const sql_loc_list = `SELECT *
      FROM location_sequence lseq
      LEFT JOIN location loc ON lseq.location_id = loc.location_id
      WHERE order_id = ${dbOrigin.escape(order_id)}`;

      const loc_seq_result = await dbOrigin.query(sql_loc_list);
      result[0].location_list = loc_seq_result;
      // console.log(result[0]);

      ret_data.status.success = true;
      ret_data.status.description = `${scriptName}_userGetOrderInfo_Success`;
      ret_data.data = { order_info: result[0] };
    } catch (err) {
      ret_data.status.success = false;
      ret_data.status.description = err;
      ret_data.data = null;
      // console.log(typeof err.stack);
      if (err.stack !== undefined) {
        ret_data.description = err.stack;
      }
    }
    callback(ret_data);
  },
};
