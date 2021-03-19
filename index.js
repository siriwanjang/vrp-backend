const express = require("express");
const db = require("./connections/database");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 4000;

// test db
db.dbConnect();
db.query("SELECT * FROM users", (err, result, field) => {
  console.log((err, result));
});
// test db

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api", (req, res) => {
  const api = req.body.api;
  const method = req.body.method;
  const data = req.body.data;

  console.log(api, method, data);
  res.send("success");
});

app.listen(port, () => {
  console.log(`listening at PORT ${port}`);
});
