const userRouter = require('express').Router();

const {
  createUser, getUsers, updateUser, updateUserAvatar, getUserById,
} = require('../controllers/users');

userRouter.post('/users', createUser);
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
