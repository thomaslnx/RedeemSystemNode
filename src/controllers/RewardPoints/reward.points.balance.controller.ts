import { Request, Response } from 'express'
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2'

import { mysqlConnection } from '../../config/database/mysql.config'
import { PointsBalance } from '../interfaces/points.balance'
import { REWARD_POINTS_QUERY } from '../../queries/reward.points.query'

type ResultQuery = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]

export const getRewardPointsBalance = async (req: Request, res: Response): Promise<Response<PointsBalance>> => {
  try {
    const pool = await mysqlConnection()
    const result: ResultQuery = await pool.query(REWARD_POINTS_QUERY.GET_POINTS)

    return res.status(200).send(result[0])
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred retrieving all points balance')
  }
}

export const getRewardsPointsBalanceFromUser = async (req: Request, res: Response): Promise<Response<PointsBalance>>  => {
  try {
    const { id } = req.params
    const pool = await mysqlConnection()
    const result: ResultQuery = await pool.query(`SELECT reward_points.points_balance, users.id AS user_id, \
      users.name, users.username, users.email FROM users LEFT JOIN reward_points on \
      reward_points.user_id=users.id WHERE users.id = ${id}`)

    if (!result[0].length) {
      return res.status(404).json({ message: 'User not found!' })
    }

    return res.status(200).send(result[0])
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
    const checkUserPointsBalance = await pool.query(`SELECT points_balance FROM reward_points WHERE user_id = ${user_id}`)

    if (!checkUserPointsBalance[0].length) {
      return res.status(404).json({ message: 'User not found!'})
    }

    let userPointsBalance
    checkUserPointsBalance[0].filter(item => userPointsBalance = item.points_balance)
    points_balance += userPointsBalance

    // Update the users points balance with the new one added
    const result: ResultQuery = await pool.query(`UPDATE reward_points SET points_balance = ${points_balance} WHERE user_id = ${user_id}`)

    return res.status(200).json({
      user: result[0].user_id,
      points: result[0].points_balance,
      last_updated: result[0].updated_at
    })
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred adding points to the user')
  }
}