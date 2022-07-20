const { adapt } = require("../adapters/express-router-adapter");
const {
	AuthUserRouterComposer,
	CreateUserRouterComposer,
	VerifyUserRouterComposer,
	ResendOTPCodeRouterComposer
} = require("../composers/_index");
const routes = require("express").Router();

routes.post("/user/login", adapt(AuthUserRouterComposer.compose()));
routes.post("/user/create", adapt(CreateUserRouterComposer.compose()));
routes.post("/user/verify", adapt(VerifyUserRouterComposer.compose()));
routes.post("/user/resend_otp", adapt(ResendOTPCodeRouterComposer.compose()));

module.exports = { routes };
