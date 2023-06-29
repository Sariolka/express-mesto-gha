const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { ERROR_NOT_FOUND } = require('./errors/errors');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { family: 4 });
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '649b1c7249b25315c24b01fd',
  };

  next();
});

app.use(router);
app.use('/', (reg, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Что-то пошло не так...' });
});
app.listen(3000, () => {
  console.log('Сервер запущен!');
});
