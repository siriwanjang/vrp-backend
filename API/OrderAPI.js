const Util = require("../Utility/Util");
var path = require("path");
const axios = require("axios");

var scriptName = path.basename(__filename, ".js");

const location = require("../controller/location.controller");
const location_sequence = require("../controller/location_sequence.controller");
const routes = require("../controller/routes.controller");

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

    // const node_num = data.node_num;
    // const distance = data.distance;
    // const estimate_time = data.estimate_time;
    const order_date = data.order_date || Util.getDateTime();
    console.log("order_date-> test", order_date);
    const car_list = data.car_list;
    // console.log(car_list);

    try {
      //   if (!Util.isValid(node_num, "number", false)) {
      //     throw `${scriptName}_modelCreateOrder_InvalidInputNodeNum`;
      //   }
      //   if (!Util.isValid(distance, "number", false)) {
      //     throw `${scriptName}_modelCreateOrder_InvalidInputDistance`;
      //   }
      //   if (!Util.isValid(estimate_time, "number", false)) {
      //     throw `${scriptName}_modelCreateOrder_InvalidInputEstimateTime`;
      //   }
      if (!Util.isValid(car_list, "list", false)) {
        throw `${scriptName}_modelCreateOrder_InvalidInputCarList`;
      }

      // const route_data = [];
      for (let e_car of car_list) {
        // console.log(e_car);
        const e_location_list = e_car.location_list;
        const e_route_data = {
          node_num: e_car.location_list.length,
          distance: e_car.total_distance,
          estimate_time: e_car.total_time,
          create_date: order_date,
          status: 1,
        };
        // create route
        const route_res = await routes.create(e_route_data);
        if (route_res === false) {
          throw `${scriptName}_modelCreateOrder_ErrorInsertRoute`;
        }
        e_route_data.route_id = route_res.dataValues.route_id;
        // check location exist
        for (let e_loc of e_location_list) {
          // validate data
          const location_data = {
            location_name: e_loc.name,
            location_type: e_loc.type,
            location_lat: e_loc.lat,
            location_long: e_loc.long,
            arrive_time: e_loc.arrive_time,
            depart_time: e_loc.depart_time,
            service_time: e_loc.service_time,
          };
          let location_id;
          const location_res = await location.findByLatLon(
            location_data.location_lat,
            location_data.location_long
          );
          // console.log(location_res[0].location_id);
          if (location_res.length === 0) {
            // insert to database
            const location_res = await location.create(location_data);
            location_id = location_res.dataValues.location_id;
          } else {
            location_id = location_res[0].location_id;
          }

          // insert sequence
          const e_seq = {
            sequence: e_loc.seq,
            route_id: e_route_data.route_id,
            location_id: location_id,
            arrive_time: location_data.arrive_time,
            depart_time: location_data.depart_time,
            service_time: location_data.service_time,
          };
          // console.log(e_seq);
          location_sequence.create(e_seq);
        }
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

    const date = data.date || Util.getDateTime().split(" ")[0];
    try {
      const route_res = await routes.getRouteInDate(date);
      // const route_res = await routes.getAllRoute();
      if (route_res.length < 1) {
        throw `${scriptName}_userGetOrderList_OrderNotFound`;
      }
      for (let [index, e_route] of route_res.entries()) {
        // e_route.test = "eiei";
        const route_id = e_route.route_id;
        // console.log("index", index);
        // console.log(route_id);
        // query loc_seq
        const loc_seq = await location_sequence.findAll(route_id);
        if (loc_seq.length < 1) {
          continue;
        } else {
          route_res[index].location_list = loc_seq;
          // for (let e_loc_seq of loc_seq) {
          //   console.log(e_loc_seq.location);
          // }
        }
      }

      ret_data.status.success = true;
      ret_data.status.description = `${scriptName}_userGetOrderList_Success`;
      // ret_data.data = { order: order, deli_order: deli_order };
      ret_data.data = { order: route_res, deli_order: [] };
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

    const route_id = data.route_id;
    try {
      if (!Util.isValid(route_id, "varchar", false)) {
        throw `${scriptName}_modelCreateOrder_InvalidInputRouteId`;
      }

      const route_res = await routes.getRouteById(route_id);
      if (route_res.length < 1 || route_res === false) {
        throw `${scriptName}_userGetOrderInfo_RouteNotFound`;
      }
      // const route_id = route_res[0].route_id;

      const loc_seq = await location_sequence.findAll(route_id);
      route_res[0].location_list = loc_seq;

      ret_data.status.success = true;
      ret_data.status.description = `${scriptName}_userGetOrderInfo_Success`;
      ret_data.data = { route_info: route_res[0] };
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
  systemUpdateOrder: async (data, callback) => {
    const ret_data = { ...std_ret };

    try {
      const today_date = data.date || Util.getDateTime().split(" ")[0];
      // const today_date = "2020-11-10";
      // check today reccord
      const result = await routes.getRouteInDate(today_date);
      if (result.length > 0) {
        throw `${scriptName}_systemUpdateOrder_DataIsUpToDate`;
      }

      const modelDb = require("../connection/modelDB");
      const model_result = await modelDb.queryData(today_date);
      if (model_result.length < 1) {
        throw `${scriptName}_systemUpdateOrder_OrderNotFound`;
      }
      const ret_result = {};
      for (let e_route of model_result) {
        // console.log(e_route);
        const route_id = e_route.ROUTE_ID;
        const total_distance = e_route.TOTAL_DISTANCE_EST;
        const total_time_arr = e_route.TOTAL_TIME_EST.split(":");
        const total_time =
          parseInt(total_time_arr[2]) +
          parseInt(total_time_arr[1]) * 60 +
          parseInt(total_time_arr[0]) * 60 * 60;
        const seq_num = e_route.INDEX_VEH;

        const src_id = e_route.SOURCE_ID;
        const des_id = e_route.DESTINATION_ID;

        const arrive_time = today_date + " " + e_route.ARRIVAL_TIME;
        const depart_time = today_date + " " + e_route.DEPART_TIME;
        const service_time_arr = e_route.SERVICE_TIME.split(":");
        const service_time =
          parseInt(service_time_arr[2]) +
          parseInt(service_time_arr[1]) * 60 +
          parseInt(service_time_arr[0]) * 60 * 60;

        const location_detail1 = {
          seq: seq_num,
          location_id: src_id,
          arrive_time: depart_time,
          depart_time: depart_time,
          service_time: service_time,
        };
        const location_detail2 = {
          seq: seq_num + 1,
          location_id: des_id,
          arrive_time: arrive_time,
          depart_time: arrive_time,
          service_time: service_time,
        };
        // console.log(location_detail2);
        // console.log(typeof ret_result[route_id]);
        if (typeof ret_result[route_id] === "undefined") {
          ret_result[route_id] = {
            total_distance: total_distance,
            total_time: total_time,
            location_list: [location_detail1, location_detail2],
          };
        } else {
          ret_result[route_id].location_list.push(location_detail2);
        }
      }

      const api_body = {
        api: "OrderAPI",
        method: "modelCreateOrder",
        data: {
          order_date: today_date,
          car_list: [],
        },
      };

      const route_keys = Object.keys(ret_result);
      for (let e_key of route_keys) {
        const location_list = ret_result[e_key].location_list;
        // console.log(e_key);
        // console.log(ret_result[e_key].location_list);

        for (let [index, e_loc] of location_list.entries()) {
          // console.log(ret_result[e_key].location_list[index]);
          const [loc_data] = await modelDb.queryLocation(e_loc.location_id);
          delete ret_result[e_key].location_list[index].location_id;
          ret_result[e_key].location_list[index].name = loc_data.NAME;
          ret_result[e_key].location_list[index].type = loc_data.TYPE;
          ret_result[e_key].location_list[index].lat = loc_data.LAT;
          ret_result[e_key].location_list[index].long = loc_data.LONG;
        }
        // console.log(ret_result[e_key]);

        const e_car_data = {
          car_id: e_key,
          ...ret_result[e_key],
        };
        api_body.data.car_list.push(e_car_data);
      }
      // console.log(api_body);
      // console.log("test");
      try {
        const api_call_res = await axios.post("http://localhost:4000/api", api_body);
        console.log(api_call_res.data);
      } catch (err) {
        console.log(err);
      }
      ret_data.status.success = true;
      ret_data.status.description = `${scriptName}_systemUpdateOrder_Success`;
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
