const userRouter = require('express').Router();

const {
  getUsers, updateUser, updateUserAvatar, getUserById, getCurrentUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateUserAvatar);
userRouter.get('/users/me', getCurrentUser);

module.exports = userRouter;
