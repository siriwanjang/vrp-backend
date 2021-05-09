const db = require("../models");
const Location = db.location;
const Op = db.Op;
// console.log(db);

// Create and Save a new Tutorial
exports.create = async (location_data) => {
  try {
    const result = await Location.create(location_data);
    return result;
  } catch (err) {
    return false;
  }
  // .then((data) => {
  //   console.log(data);
  // })
  // .catch((err) => {
  //   console.log(err.message || "Some error occurred while creating the Tutorial.");
  // });
};
exports.findByLatLon = async (lat, lon) => {
  // location
  try {
    const result = await Location.findAll({
      raw: true,
      // attributes: ["password"],
      where: {
        location_lat: {
          [Op.eq]: lat,
        },
        location_long: {
          [Op.eq]: lon,
        },
      },
    });
    return result;
  } catch (err) {
    return false;
  }
};

// // Retrieve all Tutorials from the database.
// exports.findAll = (req, res) => {};

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
