const db = require("../models");
const location_sequence = db.location_sequence;
const Op = db.Op;
// console.log(db);

// Create and Save a new Tutorial
exports.create = async (locseq_data) => {
  try {
    const result = await location_sequence.create(locseq_data);
    return result;
  } catch (err) {
    return false;
  }
};

// // Retrieve all Tutorials from the database.
exports.findAll = async (route_id) => {
  try {
    const result = await location_sequence.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "route_id"] },
      include: [
        {
          model: db.location,
          as: "location",
          attributes: { exclude: ["createdAt", "updatedAt", "location_id"] },
        },
      ],
      where: {
        route_id: {
          [Op.eq]: route_id,
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
