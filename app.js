const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { ERROR_NOT_FOUND } = require('./errors/errors');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { family: 4 });
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '649b1c7249b25315c24b01fd',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use('/', (reg, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Что-то пошло не так...' });
});
app.listen(3000, () => {
  console.log('Сервер запущен!');
});
