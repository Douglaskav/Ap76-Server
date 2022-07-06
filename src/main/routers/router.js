const { adapt } = require("../");
const routes = require("express").Router();

routes.get("/", (req, res) => {
  res.json({ body: "Routes is working !!!" });
});

module.exports = { routes };
