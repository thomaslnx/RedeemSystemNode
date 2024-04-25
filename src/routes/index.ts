import { Router } from 'express'
import { getUsers, createUser, getUser, deleteUser, updateUser } from '../controllers/Users/user.controller.ts'
import { getRewardPointsBalance, addPointsToUser, getRewardsPointsBalanceFromUser } from '../controllers/RewardPoints/reward.points.balance.controller.ts'
import { getAllRewards, createReward } from '../controllers/Rewards/rewards.controller.ts'
import { getRedemptions, redeemReward, redeemHistory } from '../controllers/Redemptions/redemptions.controller.ts'

export const pointsRoutes = Router()
export const userRoutes = Router()
export const rewardsRoutes = Router()
export const redemptionsRoutes = Router()

userRoutes.route('/')
  .get(getUsers)
  .post(createUser)

userRoutes.route('/:userId')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

pointsRoutes.route('/balance')
  .get(getRewardPointsBalance)

pointsRoutes.route('/balance/:id')
  .get(getRewardsPointsBalanceFromUser)

pointsRoutes.route('/add')
  .post(addPointsToUser)

rewardsRoutes.route('/')
  .get(getAllRewards)
  .post(createReward)

redemptionsRoutes.route('/')
.get(getRedemptions)

redemptionsRoutes.route('/redeem')
.post(redeemReward)

redemptionsRoutes.route('/history/:userId')
  .get(redeemHistory)