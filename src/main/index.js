const app = require("./app");
const MongoHelper = require("../infra/helpers/mongo-helper");

MongoHelper.connect(process.env.MONGO_URL).then(() => {
  app.listen(app.get("PORT"), () =>
    console.log(`Server running in port ${app.get("PORT")}`)
  );
});
