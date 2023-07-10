const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/error-not-found');
const regex = require('../utils/regex');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30).optional(),
      about: Joi.string().min(2).max(30).optional(),
      avatar: Joi.string().optional()
        .pattern(regex),
    }),
  }),
  createUser,
);
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6).max(30),
    }),
  }),
  login,
);

router.use(auth);
router.use(userRouter);
router.use(cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Такая страница не существует'));
});
module.exports = router;
