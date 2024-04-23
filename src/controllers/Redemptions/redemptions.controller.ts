import { Request, Response } from 'express'
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2'

import { mysqlConnection } from '../../config/database/mysql.config'
import { Redemptions } from '../interfaces/redemptions'
import { REDEMPTIONS_QUERY } from '../../queries/redemptions.query'

type ResultQuery = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]

export const getRedemptions = async (req: Request, res: Response): Promise<Response<Redemptions>> => {
  try {
    const pool = await mysqlConnection()
    const result: ResultQuery = await pool.query(REDEMPTIONS_QUERY.SELECT_REDEMPTIONS)

    return res.status(200).send(result[0])
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred')
  }
}