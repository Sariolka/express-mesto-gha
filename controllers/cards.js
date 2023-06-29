const Card = require('../models/card');

const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() =>
      res.status(ERROR_DEFAULT).send({
        message: 'На сервере произошла ошибка',
      })
    );
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Данные некорректны' });
        return;
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'Not Found') {
        res.status(ERROR_VALIDATION || ERROR_NOT_FOUND).send({ message: 'Карточка не найдена!' });
        console.log(err.name);
        return;
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Данные некорректны' });
        return;
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена!' });
        return;
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Данные некорректны' });
        return;
      } else if (err.message === 'Not Found') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена!' });
        return;
      } else {
        res
          .status(ERROR_DEFAULT)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
