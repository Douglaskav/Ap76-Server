const AuthUserRouterComposer = require("../composers/auth-user-router-composer");
const CreateUserRouterComposer = require("../composers/create-user-router-composer");
const VerifyUserRouterComposer = require("../composers/verify-user-router-composer");
const ResendOTPCodeRouterComposer = require("../composers/resend-otp-code-composer");

module.exports = {
	AuthUserRouterComposer,
	CreateUserRouterComposer,
	VerifyUserRouterComposer,
	ResendOTPCodeRouterComposer
}