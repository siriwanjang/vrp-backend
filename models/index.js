const { Sequelize, DataTypes, Op } = require("sequelize");
const db_config = require("../config/db.config.js");
const sequelize = new Sequelize(db_config.DB, db_config.USER, db_config.PASSWORD, {
  host: db_config.HOST,
  dialect: db_config.dialect,
  port: db_config.PORT,
  //   operatorsAliases: false,
  pool: {
    max: db_config.pool.max,
    min: db_config.pool.min,
    acquire: db_config.pool.acquire,
    idle: db_config.pool.idle,
  },
});
// async function test() {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// }
// test();

const db = {};
db.DataTypes = DataTypes;
db.Op = Op;
db.sequelize = sequelize;

db.users = require("./users.model")(sequelize, DataTypes);
db.user_role = require("./user_role.model")(sequelize, DataTypes);
// create foreign key to role_id
db.users.belongsTo(db.user_role, { foreignKey: "role_id", as: "role" });
db.location = require("./location.model")(sequelize, DataTypes);
db.routes = require("./routes.model")(sequelize, DataTypes);
db.routes.belongsTo(db.users, { foreignKey: "assignee_id", as: "assignee" });
db.location_sequence = require("./location_sequence.model")(sequelize, DataTypes);
db.location_sequence.belongsTo(db.routes, { foreignKey: "route_id", as: "route" });
db.location_sequence.belongsTo(db.location, { foreignKey: "location_id", as: "location" });

module.exports = db;
