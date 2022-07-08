require("dotenv").config();
const express = require("express");
const app = express();
const { routes } = require("./routers/routes.js");

app.set("PORT", process.env.PORT || 3333);
app.use(express.json());
app.use(routes);

module.exports = app;
