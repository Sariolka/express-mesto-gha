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
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      if (!card) {
        throw new NotFoundError('Карточка не найдена!');
      }
      card.deleteOne()
        .then(() => res.status(OK).send());
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена!');
      }
      res.status(OK).send(card);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена!');
      }
      res.status(OK).send(card);
    })
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
