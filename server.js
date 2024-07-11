const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");

//Router
const mountRoutes = require("./routes");

//Connect With db
dbConnection();

//express app
const app = express();

//Enable other domain to acsess your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

//Midlwares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

//Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Cant Find This Route ${req.originalUrl}`, 400));
});

//Golbal Error Handling Midlware for Express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running on port ${PORT} `);
});

//Handling Error(Rejection) OutSide Express
//Event =>List =>Callback(err)
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Error:- ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down.....");
    process.exit(1);
  });
});
