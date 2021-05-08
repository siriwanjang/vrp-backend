module.exports = (sequelize, DataTypes) => {
  const LocationSequence = sequelize.define("location_sequence", {
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      allowNull: false,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return LocationSequence;
};
