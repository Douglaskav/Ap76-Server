const express = require("express");
const { routes }  = require("./routers/router.js");
const app = express();

app.set("PORT", process.env.PORT || 3333);
app.use(routes)

app.listen(app.get("PORT"), () =>
  console.log(`Server running in port ${app.get("PORT")}`)
);
