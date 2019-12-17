const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');

// Does a dotenv file for environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware set up
app.use(cors());
// Tells before the routes for the server to use json format for everything.
app.use(express.json());

// Database mongodb uri from Mongodb
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('mongoDB Database connection establisehd successfully');
});

// Require the files and then use them.

const reportsRouter = require('./routes/reports');
const usersRouter = require('./routes/users');

app.use('/reports', reportsRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
