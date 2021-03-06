const express = require("express");
const fs = require("fs");
// const db = require("./connections/database");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const port = 4000;

const db = require("./models/index");
db.sequelize.sync({ alter: false, force: false }).then(() => {
  // console.log("Drop and re-sync db.");
});

app.get("/", (req, res) => {
  res.send("VRP-Backend is running...");
});

app.post("/api", (req, res) => {
  let ret_data = { status: { success: false, description: "" }, data: null };

  const api = req.body.api;
  const method = req.body.method;
  const data = req.body.data;

  try {
    if (fs.existsSync(`./API/${api}.js`)) {
      const requestAPI = require("./API/" + api);
      // check call undefined method
      if (typeof requestAPI[method] === "undefined") {
        throw "call undefined method";
      } else {
        requestAPI[method](data, (result) => {
          // console.log(result);
          ret_data.status = result.status;
          ret_data.data = result.data;
          if (ret_data.data === null) {
            delete ret_data.data;
          }
          res.send(ret_data);
          return;
        });
      }
    } else {
      throw `There are no ${api} here`;
    }
  } catch (err) {
    // console.log(err);
    ret_data.status.success = false;
    ret_data.status.description = err;
    if (ret_data.data === null) {
      delete ret_data.data;
    }

    res.send(ret_data);
  }
});

app.listen(port, () => {
  console.log(`listening at PORT ${port}`);
});
