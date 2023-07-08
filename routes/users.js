const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, updateUser, updateUserAvatar, getUserById, getCurrentUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex(),
    }),
  }),
  getUserById,
);

userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

userRouter.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required()
        .pattern(/(https)?:\/\/(www\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]{2,}\.[a-z0-9/#?]{2,}$/),
    }),
  }),
  updateUserAvatar,
);

userRouter.get('/users/me', getCurrentUser);

module.exports = userRouter;
