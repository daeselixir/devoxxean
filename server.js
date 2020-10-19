const mongoose=require('mongoose')
const app=require('./app')


const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful 🚀 ⚡️ "));
// .catch(err => console.log('Huno un error'))
const port = process.env.PORT || 4000;

//Iniciamos el servidor y estamos escuchando con Listen
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});