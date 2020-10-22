const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitaze = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./helpers/appError");

//Routes

const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

//Body parser nos sirve para manejar todo el cuerpo de la request y la respuesta y como se
//van a devolver esos datos

dotenv.config({
	path: "./.env",
});

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
const globalErrorHandler = require("./helpers/dbErrorHandler");

//app engloba todas las funciones de express

const app = express();

//GLOBAL Middlewares
//Set Security HTTP headers
app.use(helmet());

//Development logging

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

//Limit request
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many request from this IP,please true again in an hour",
});

app.use("/api", limiter);

//Body parser, reading data from body into req.body

app.use(
	express.json({
		limit: "10kb",
	})
);

//Data sanitization against NoSql query injection

app.use(mongoSanitaze());

//Data sanitization against XSS

app.use(xss());

//Prevent parameter pullution

app.use(
	hpp({
		whitelist: [
			"duration",
			"ratingsQuantity",
			"ratingsAverage",
			"maxGroupSize",
			"difficulty",
			"price",
		],
	})
);

//Serving static files

app.use(express.static(`${__dirname}/public`));
/*app.use(cookieParser());
app.use(expressValidator());*/
app.use(cors());

//Test middleware

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	//console.log(req.headers);
	next();
});

//Routes

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/review", reviewRoutes);
app.use(globalErrorHandler);

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
