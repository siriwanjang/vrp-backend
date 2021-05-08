const db = require("../models");
const Users = db.users;
const Op = db.Op;
// console.log(db);

// Create and Save a new Tutorial
// exports.create = (req, res) => {
//   const user = {
//     username: "test",
//     password: "password",
//     role_id: 1,
//   };
//   Users.create(user)
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log(err.message || "Some error occurred while creating the Tutorial.");
//     });
// };

exports.getPassword = async (username) => {
  return await Users.findOne({
    raw: true,
    attributes: ["password"],
    where: {
      username: {
        [Op.eq]: username,
      },
    },
  });
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
