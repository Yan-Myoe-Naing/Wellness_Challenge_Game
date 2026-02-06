const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const mainRoutes = require('./routes/mainRoutes');
app.use("/api", mainRoutes);
app.use("/",express.static('public'))

// Health check
app.get('/', (req, res) => {
  res.send('I am Alive!')
});
module.exports = app;

