const { adapt } = require("../adapters/express-router-adapter");
const AuthUserRouterComposer = require("../composers/auth-user-router-composer");
const CreateUserRouterComposer = require("../composers/create-user-router-compose");
const routes = require("express").Router();

routes.post("/user/login", adapt(AuthUserRouterComposer.compose()));
routes.post("/user/create", adapt(CreateUserRouterComposer.compose()));
routes.post("/user/verify", adapt(CreateUserRouterComposer.compose()));

module.exports = { routes };
