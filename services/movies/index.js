var os = require("os");
const express = require("express");
const app = express();
const port = process.env.PORT;

app.get("/top", (req, res) => {
  res.send([
    { title: "Mandalorian" },
    { title: "Dark" },
    { title: "Black Mirror" },
  ]);
});

app.get("/recommended/user/101", (req, res) => {
  res.send([
    { title: "Iron Man" },
    { title: "Star Wars" },
    { title: "Black Mirror" },
  ]);
});

app.get("/healthcheck", (req, res) => {
  res.send({
    status: "ok",
    hostname: os.hostname(),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
