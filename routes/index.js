const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.use(userRouter);
router.use(cardRouter);
router.post('/signin', login);
router.post('/signup', createUser);
router.use(auth);
module.exports = router;
