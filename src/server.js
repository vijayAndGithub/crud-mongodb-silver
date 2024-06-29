const express = require("express");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config/config");
const { connectDB } = require("./config/dbConfig");
const v1Routes = require("./routes/v1/index");
const {
  errorHandler,
  notFound,
  badJSONHandler,
} = require("./middlewares/errorMiddlewares");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
//Socket
const app = express();

app.use(compression());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User CRUD API',
      version: '1.0.0',
      description: 'API for managing users'
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`
      }
    ]
  },
  apis: [ './routes/*.js' ]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs));



//connect to mongodb server
connectDB();

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(badJSONHandler);

//base url
app.get("/", (req, res) => {
  const statusCode = httpStatus.OK;
  return res.status(statusCode).json({
    success: true,
    code: statusCode,
    message: "",
  });
});

//v1 api routes
app.use("/api/v1", v1Routes);

//404
app.use(notFound);
app.use(errorHandler);

//socket
const server = require('http').createServer(app);
server.listen(config.PORT, () => {
  console.log(`Listening on http://localhost:${config.PORT}`);
});