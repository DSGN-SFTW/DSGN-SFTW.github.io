require("dotenv").config();

const dbConfigOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
};

module.exports = {
  DB_CONNECTION_URL: "mongodb://localhost:27017/4code",
  dbConfigOptions
};
