const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./helpers/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
//const bookingRouter = require("./routes/bookingRoutes");
//const bookingController = require("./controllers/bookingController");
const viewRouter = require("./routes/viewRoutes");

// Start express app
const app = express();

app.enable("trust proxy");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options("*", cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers

//LLER MAS SOBRE ESTO
app.use(helmet());

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'", "data:", "blob:"],

			baseUri: ["'self'"],

			fontSrc: ["'self'", "https:", "data:"],

			scriptSrc: ["'self'", "https://*.cloudflare.com"],

			scriptSrc: ["'self'", "https://*.stripe.com"],

			scriptSrc: ["'self'", "http:", "https://*.mapbox.com", "data:"],

			frameSrc: ["'self'", "https://*.stripe.com"],

			objectSrc: ["'none'"],

			styleSrc: ["'self'", "https:", "'unsafe-inline'"],

			workerSrc: ["'self'", "data:", "blob:"],

			childSrc: ["'self'", "blob:"],

			imgSrc: ["'self'", "data:", "blob:"],

			connectSrc: ["'self'", "blob:", "https://*.mapbox.com"],

			upgradeInsecureRequests: [],
		},
	})
);
/*
"Content-Security-Policy",
			"default-src 'self' https://*.mapbox.com https://*.stripe.com 
			;base-uri 'self';
			block-all-mixed-content;
			font-src 'self' https: data:;
			frame-ancestors 'self';img-src 'self' data:;
			object-src 'none';
			script-src https://*.cloudflare.com https://*.mapbox.com https://*.stripe.com 'self' blob: ;
			script-src-attr: 'none';
			style-src 'self' https: 'unsafe-inline';
		
		/*	upgrade-insecure-requests;"*/
/*
app.use(
	helmet.contentSecurityPolicy({

		directives: {
			defaultSrc: ['self', 'https://*.mapbox.com https://*.stripe.com https://*.cloudflare.com'],
			baseUri: ['self'],
			fontSrc: ['self', 'https:','http:', 'data:'],
			scriptSrc: ['self','https://*.mapbox.com https://*.stripe.com https://*.cloudflare.com'],
			scriptSrcAttr:['none'],
			styleSrc: ['self', 'https:', 'http:','unsafe-inline']
			
		}
	})
);
*/
// Development logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
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

//app.use(compression());

// Test middleware
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	//console.log(req.cookies);

	next();
});

// 3) ROUTES

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
//app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
