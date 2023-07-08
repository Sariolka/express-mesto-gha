const Card = require('../models/card');
const ValidationError = require('../errors/error-validation');
const ForbiddenError = require('../errors/error-forbidden');
const NotFoundError = require('../errors/error-not-found');
const { OK } = require('../errors/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(ValidationError('Данные некорректны'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  Card.findById(id)
    .orFail(() => new Error('Not Found'))
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        card.findByIdAndRemove(card)
          .then((item) => res.status(OK).send(item))
          .catch(next);
      } else {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(ValidationError('Данные некорректны'));
      } else if (err.message === 'Not Found') {
        next(NotFoundError('Карточка не найдена!'));
      } next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(ValidationError('Данные некорректны'));
      } else if (err.message === 'Not Found') {
        next(NotFoundError('Карточка не найдена!'));
      } next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
