module.exports = {
  // connectionLimit: 10,
  HOST: "app.aws.wasin.me",
  USER: "vrpapp",
  PASSWORD: "vrpapp0000",
  DB: "app_db",
  PORT: 3306,
  dialect: "mysql",
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
};
