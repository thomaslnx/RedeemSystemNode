import { Request, Response } from 'express'
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2'

import { mysqlConnection } from '../../config/database/mysql.config.ts'
import { Redemptions } from '../../interfaces/redemptions.ts'
import { REDEMPTIONS_QUERY } from '../../queries/redemptions.query.ts'

export const getRedemptions = async (req: Request, res: Response): Promise<Response<Redemptions>> => {
  try {
    const pool = await mysqlConnection()
    const [ results ]= await pool.query<RowDataPacket[]>(REDEMPTIONS_QUERY.SELECT_REDEMPTIONS)

    return res.status(200).send(results)
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred retrieving the redemptions')
  }
}

export const redeemReward = async (req: Request, res: Response): Promise<Response<Redemptions>> => {
  const { user_id, reward_id, how_many_items, points_spent } = req.body

  try {
    const pool = await mysqlConnection()
    const [ reward ] = await pool.query<RowDataPacket[]>(`SELECT * FROM rewards WHERE id = ${reward_id}`)
    if (!reward.length) {
      return res.status(404).json({ message: 'Reward not found' })
    }

    let rewardId
    let points_required
    let quantity_available
    let currentUserPointsBalance: number = 0

    const rewardData = reward.map(item => {
      rewardId = item.id
      points_required = item.points_required
      quantity_available = item.quantity_available
    })

    const [ user ] = await pool.query<RowDataPacket[]>(`SELECT reward_points.points_balance, users.id AS user_id, \
      users.name, users.username, users.email FROM users LEFT JOIN reward_points on \
      reward_points.user_id=users.id WHERE users.id = ${user_id}`)

    const userData = user.map(user => currentUserPointsBalance = user.points_balance)

    if (!user.length) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (quantity_available !== undefined) {
      if (how_many_items > quantity_available) {
        return res.status(400).json({ message: 'Quantity required greater than available!' })
      }
    }

    if (how_many_items < 1) {
      return res.status(400).json({ message: 'You have to provide at least 1 item to be redeemed' })
    }

    let pointsRequiredToRedeem: number = 0
    let rewardQuantityAvailableUpdated

    if (points_required !== undefined){
      pointsRequiredToRedeem = points_required * how_many_items
    }

    if (points_spent < pointsRequiredToRedeem) {
      return res.status(400).json({ message: 'The points quantity is not enough to redeem this item!'})
    }

    if (pointsRequiredToRedeem > currentUserPointsBalance) {
      return res.status(400).json({ message: 'Your current points balance is not enough to redeem this item!'})
    }

    if (quantity_available !== undefined) {
      rewardQuantityAvailableUpdated = quantity_available - how_many_items
    }
    const userPointsBalanceUpdated = currentUserPointsBalance - pointsRequiredToRedeem

    // updating users points balance and reward quantity available
    await pool.query(`UPDATE rewards SET quantity_available = ${rewardQuantityAvailableUpdated} WHERE id = ${rewardId}`)
    await pool.query(`UPDATE reward_points SET points_balance = ${userPointsBalanceUpdated} WHERE user_id = ${user_id}`)

    const redemptionDate = Date.now()

    await pool.query(`INSERT INTO redemptions (user_id, reward_id, points_spent) VALUES(${user_id}, ${rewardId}, ${pointsRequiredToRedeem})`)

    return res.status(200).json({ message: 'Redemption made with success!'})
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred retrieving the redemptions')
  }
}

export const redeemHistory = async (req: Request, res: Response): Promise<Response<Redemptions>> => {
  const { userId } = req.params

  try {
    const pool = await mysqlConnection()
    let rewardName
    let redemptionDate
    let pointsSpent
    let historyId

    const [ history ] = await pool.query<RowDataPacket[]>(`SELECT r.name AS name, \
                                             rd.id AS id, \
                                             rd.user_id, \
                                             rd.redemption_date, \
                                             rd.points_spent \
                                      FROM redemptions rd \
                                      JOIN users u ON rd.user_id = ${userId}
                                      JOIN rewards r ON rd.reward_id = r.id \
                                      WHERE u.id = ${userId}`)

    const historyData = history.map(redHistory => {
      historyId = redHistory.id
      rewardName = redHistory.name
      redemptionDate = redHistory.redemption_date
      pointsSpent = redHistory.points_spent

      return ({
        historyId,
        rewardName,
        redemptionDate,
        pointsSpent
      })
    })

    return res.status(200).json(historyData)
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred retrieving the redemptions history')
  }
}