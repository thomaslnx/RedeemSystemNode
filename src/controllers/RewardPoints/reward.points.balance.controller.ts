import { Request, Response } from 'express'
import { RowDataPacket } from 'mysql2/promise'

import { mysqlConnection } from '../../config/database/mysql.config.ts'
import { PointsBalance } from '../../interfaces/points.balance.ts'
import { REWARD_POINTS_QUERY } from '../../queries/reward.points.query.ts'

export const getRewardPointsBalance = async (req: Request, res: Response): Promise<Response<PointsBalance>> => {
  try {
    const pool = await mysqlConnection()
    const [ results ]= await pool.query<RowDataPacket[]>(REWARD_POINTS_QUERY.GET_POINTS)

    return res.status(200).send(results)
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred retrieving all points balance')
  }
}

export const getRewardsPointsBalanceFromUser = async (req: Request, res: Response): Promise<Response<PointsBalance>>  => {
  try {
    const { id } = req.params
    const pool = await mysqlConnection()
    const [ results ] = await pool.query<RowDataPacket[]>(`SELECT reward_points.points_balance, users.id AS user_id, \
      users.name, users.username, users.email FROM users LEFT JOIN reward_points on \
      reward_points.user_id=users.id WHERE users.id = ${id}`)

    if (!results.length) {
      return res.status(404).send('This user has no points!')
    }

    return res.status(200).send(results)
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred retrieving this user points balance')
  }
}

export const addPointsToUser = async (req: Request, res: Response): Promise<Response<PointsBalance>>  => {
  let { user_id, points_balance } = req.body

  try {
    const pool = await mysqlConnection()
    // Retrieve user current balance to make the add operation.
    const [ checkUserPointsBalance ] = await pool.query<RowDataPacket[]>(`SELECT points_balance FROM reward_points WHERE user_id = ${user_id}`)

    if (!checkUserPointsBalance.length) {
      return res.status(404).json({ message: 'User not found!'})
    }

    let userPointsBalance
    checkUserPointsBalance.filter(item => userPointsBalance = item.points_balance)
    points_balance += userPointsBalance

    // Update the users points balance with the new one added
    const [ results ] = await pool.query<RowDataPacket[]>(`UPDATE reward_points SET points_balance = ${points_balance} WHERE user_id = ${user_id}`)

    return res.status(200).json({
      message: 'Points added successfully'
    })
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred adding points to the user')
  }
}