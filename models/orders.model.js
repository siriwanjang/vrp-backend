module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define("orders", {
    order_id: {
      type: DataTypes.STRING(16),
      allowNull: true,
      primaryKey: true,
      //   autoIncrement: true,
    },
    node_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estimate_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assignee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Orders;
};
