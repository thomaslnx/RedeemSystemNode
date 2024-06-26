import { Request, Response } from 'express'
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2'

import { mysqlConnection } from '../../config/database/mysql.config.ts'
import { Reward } from '../../interfaces/rewards.ts'
import { REWARDS_QUERY } from '../../queries/rewards.query.ts'

type ResultQuery = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]

export const getAllRewards = async (req: Request, res: Response): Promise<Response<Reward>> => {
  try {
    const pool = await mysqlConnection()
    const result: ResultQuery = await pool.query(REWARDS_QUERY.SELECT_REWARDS)

    return res.status(200).send(result[0])
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred getting the rewards')
  }
}

export const createReward = async (req: Request, res: Response) => {
  try {
    const pool = await mysqlConnection()
    const { name, description, points_required, quantity_available } = req.body

    const reward = {
      name: name,
      description: description,
      pointsRequired: points_required,
      quantityAvailable: quantity_available
    }

    const result: ResultQuery = await pool.query(REWARDS_QUERY.CREATE_REWARD, Object.values(reward))

    return res.status(200).json(reward)
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred creating reward')
  }
}