module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define("location", {
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    location_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    location_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    location_lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    location_long: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return Location;
};
