const Util = require("../Utility/Util");
var path = require("path");
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
          create_date: Util.getDateTime(),
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
    try {
      const route_res = await routes.getAllRoute();
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
      ret_data.data = { route_info: route_res };
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
