const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/error-validation');
const NotFoundError = require('../errors/error-not-found');
const ConflictError = require('../errors/error-conflict');
const UnauthorizedError = require('../errors/error-unauthorized');
const { OK } = require('../errors/errors');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Данные некорректны');
      } if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким e-mail уже существует');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-secret-key', { expiresIn: '7d' });
      res.status(OK).send({ _id: token });
    })
    .catch(() => {
      next(UnauthorizedError('Необходима авторизация'));
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(ValidationError('Пользователь не найден'));
      } else if (err.message === 'Not Found') {
        next(NotFoundError('Пользователь не найден'));
      } next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(ValidationError('Пользователь не найден'));
      } else if (err.message === 'Not Found') {
        next(NotFoundError('Пользователь не найден'));
      } next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(ValidationError('Данные некорректны'));
      } else if (err.message === 'Not Found') {
        next(NotFoundError('Пользователь не найден'));
      } next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(ValidationError('Данные некорректны'));
      } else if (err.message === 'Not Found') {
        next(NotFoundError('Пользователь не найден'));
      } next(err);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  login,
  getCurrentUser,
};
