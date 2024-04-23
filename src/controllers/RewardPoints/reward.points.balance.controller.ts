import { Request, Response } from 'express'
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2'

import { mysqlConnection } from '../../config/database/mysql.config'
import { PointsBalance } from '../interfaces/points.balance'
import { REWARD_POINTS_QUERY } from '../../queries/reward.points.query'

type ResultQuery = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]

export const getRewardPointsBalance = async (req: Request, res: Response): Promise<Response<PointsBalance>> => {
  try {
    const pool = await mysqlConnection()
    const result: ResultQuery = await pool.query(REWARD_POINTS_QUERY.SELECT_POINTS)
    
    return res.status(200).send(result[0])
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred')
  }
}

export const addPointsToUser = async (req: Request, res: Response): Promise<Response<PointsBalance>>  => {
  try {
    const pool = await mysqlConnection()
    const result: ResultQuery = await pool.query(REWARD_POINTS_QUERY.CREATE_POINT, Object.values(req.body))

    return res.status(200).json({
      user: result[0].user_id,
      points: result[0].points_balance,
      last_updated: result[0].updated_at
    })
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred')
  }
}