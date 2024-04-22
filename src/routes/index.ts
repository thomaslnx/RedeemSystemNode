import { Router } from 'express'
import { getUsers, createUser, getUser, deleteUser, updateUser } from '../controllers/Users/user.controller'

export const redeemRoutes = Router()
export const userRoutes = Router()

userRoutes.route('/')
  .get(getUsers)
  .post(createUser)

userRoutes.route('/:userId')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)
