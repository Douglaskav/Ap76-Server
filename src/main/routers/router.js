const { adapt } = require("../adapters/express-router-adapter");
const LoginRouterComposer = require("../composers/login-router-composer");
const routes = require("express").Router();

routes.get("/", (req, res) => {
  res.json({ body: "Routes is working !!!" });
});

routes.post("/user/login", adapt(LoginRouterComposer.compose()));

module.exports = { routes };
