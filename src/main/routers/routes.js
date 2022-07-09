const { adapt } = require("../adapters/express-router-adapter");
const AuthUserRouterComposer = require("../composers/auth-user-router-composer");
const routes = require("express").Router();

routes.post("/user/login", adapt(AuthUserRouterComposer.compose()));
routes.post("/user/create", adapt(AuthUserRouterComposer.compose()));

module.exports = { routes };
