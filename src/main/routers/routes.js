const { adapt } = require("../adapters/express-router-adapter");
const {
	AuthUserRouterComposer,
	CreateUserRouterComposer,
	VerifyUserRouterComposer,
} = require("../composers/");
const routes = require("express").Router();

routes.post("/user/login", adapt(AuthUserRouterComposer.compose()));
routes.post("/user/create", adapt(CreateUserRouterComposer.compose()));
routes.post("/user/verify", adapt(VerifyUserRouterComposer.compose()));
// routes.post("/user/resend_otp", adapt(VerifyUserRouterComposer.compose()));

module.exports = { routes };
