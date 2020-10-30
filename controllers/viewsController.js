const Tour = require("../models/tourModel");
const User = require("../models/user");
const Booking = require("../models/bookingModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");
const moment = require("moment");

let esp = moment.locale("es");

exports.getOverview = catchAsync(async (req, res) => {
	//1- Get tour data from collection
	const tours = await Tour.find();

	//2- Build template

	//3- Render that template using tour data from 1-
	res.status(200)
	/*.set(
			"Content-Security-Policy",
			"default-src 'self' https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://*.cloudflare.com https://*.mapbox.com https://*.stripe.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
		)*/.render("overview", {
		title: "All tours",
		tours,
		esp,
		moment,
	});
});

exports.getTour = catchAsync(async (req, res, next) => {
	// 1) Get the data, for the requested tour (including reviews and guides)
	//console.log(req.params.slug);
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: "reviews",
		fields: "review rating user",
	});

	if (!tour) {
		return next(new AppError("There is no tour with that name.", 404));
	}

	// 2) Build template
	// 3) Render template using data from 1)
	res
		.status(200)
		/*.set(
			"Content-Security-Policy",
			"default-src 'self' https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://*.cloudflare.com https://*.mapbox.com https://*.stripe.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
		)*/
		.render("tour", {
			title: `${tour.name} Tour`,
			tour,
			esp,
			moment,
		});
});



exports.getLoginForm = (req, res) => {
	res.status(200).render("login", {
		title: "Log into your account",
	});
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

