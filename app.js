const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const router = require('./routes');
const error = require('./middlewares/error');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(helmet());
app.use(limiter);
mongoose.connect('mongodb://localhost:27017/mestodb', { family: 4 });
app.use(express.json());
app.use(router);
app.use(errors());
app.use(error);
app.listen(3000, () => {
  console.log('Сервер запущен!');
});
