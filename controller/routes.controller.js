const db = require("../models");
const routes = db.routes;
const Op = db.Op;
// console.log(db);

// Create and Save a new Tutorial
exports.create = async (route_data) => {
  try {
    const result = await routes.create(route_data);
    return result;
  } catch (err) {
    return false;
  }
};

// // Retrieve all Tutorials from the database.
exports.getAllRoute = async () => {
  try {
    const result = await routes.findAll({
      raw: true,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      // include: [{ model: db.location_sequence }],
    });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.getRouteById = async (route_id) => {
  try {
    const result = await routes.findAll({
      raw: true,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        route_id: {
          [Op.eq]: route_id,
        },
      },
      // include: [{ model: db.location_sequence }],
    });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.getRouteInDate = async (date) => {
  console.log();
  const start_date = date + " " + "00:00:00";
  const end_date = date + " " + "23:59:59";
  console.log(start_date, end_date);
  try {
    const result = await routes.findAll({
      raw: true,
      attributes: { exclude: ["createdAt", "updatedAt"] },
      // include: [{ model: db.location_sequence }],
      where: {
        create_date: {
          [Op.gt]: start_date,
          [Op.lt]: end_date,
        },
      },
    });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// // Find a single Tutorial with an id
// exports.findOne = (req, res) => {};

// // Update a Tutorial by the id in the request
// exports.update = (req, res) => {};

// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {};

// // Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {};

// // Find all published Tutorials
// exports.findAllPublished = (req, res) => {};
