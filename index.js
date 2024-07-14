const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");

//Router
const mountRoutes = require("./routes/index1");
const { webhookCheckout } = require("./services/orderService");

//Connect With db
dbConnection();

//express app
const app = express();

//Enable other domain to acsess your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//Midlwares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

// To remove data using these defaults:
app.use(mongoSanitize());
// make sure this comes before any routes
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message:
    "Too many account creatrd from this Ip, please try again after an 15 mints",
});
// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

//middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

//Routes
mountRoutes(app);
app.get("/", (req, res) => {
  res.send("<h1>صلي علي النبي كدا</br></br> 😎😂 متجيش عشان مفيش الالا </h1>");
});

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
