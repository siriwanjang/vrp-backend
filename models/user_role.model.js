module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define("user_role", {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  });

  return UserRole;
};
