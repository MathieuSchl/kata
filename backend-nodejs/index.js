const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST", "DELETE", "PUT"],

  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

require("./functions/apiActions").startApi(app);

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Back-end API",
      version: require("./package.json").version,
      description: "Hello and welcome to the API documentation of the backend-service.\n",
    },
    servers: [
      {
        url: process.env.API + "/api/v1/",
      },
    ],
  },
  apis: ["./api/*.js", "./api/*/*.js", "./api/*/*/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

async function start() {
  app.db = await require("./functions/dataBase/createConnection").open();
  app.executeQuery = require("./functions/dataBase/executeQuery").run;

  const port = process.env.PORT;
  app.listen(port);
  console.log();
  console.log("Server is now listening port " + port);
}

start();

module.exports.closeServer = () => {
  app.db.end();
  server.close();
  process.exit(0);
};
