const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const error = require('./middlewares/error');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { family: 4 });
app.use(express.json());
app.use(router);
app.use(errors());
app.use(error);
app.listen(3000, () => {
  console.log('Сервер запущен!');
});
