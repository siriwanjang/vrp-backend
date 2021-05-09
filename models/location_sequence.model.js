module.exports = (sequelize, DataTypes) => {
  const LocationSequence = sequelize.define("location_sequence", {
    route_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    arrive_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    depart_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    service_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return LocationSequence;
};
