const express = require("express");
const { routes } = require("./routers/router.js");
const MongoHelper = require("../infra/helpers/mongo-helper");
const app = express();

app.set("PORT", process.env.PORT || 3333);
app.use(express.json());
app.use(routes);

MongoHelper.connect(process.env.MONGO_URL).then(() => {
  app.listen(app.get("PORT"), () =>
    console.log(`Server running in port ${app.get("PORT")}`)
  );
});
