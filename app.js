const express=require('express')
const morgan =require('morgan')
const dotenv=require('dotenv')


//Routes

const userRouter=require('./routes/userRoutes')
const tourRouter=require('./routes/tourRoutes')

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

//Middlewares
//Cargamos morgan solo en un entorno Desarrollo

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  //console.log(req.headers);
  next()
})
//Routes 

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use(globalErrorHandler);


module.exports = app;