import { Request, Response } from 'express'
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2'
import bcrypt from 'bcrypt'

import { mysqlConnection } from '../../config/database/mysql.config'
import { User } from '../interfaces/user'
import { USER_QUERY } from '../../queries/user.query'

type ResultQuery = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]

export const getUsers = async (req: Request, res: Response): Promise<Response<User[]>> => {
  try {
    const pool = await mysqlConnection()
    const result: ResultQuery = await pool.query(USER_QUERY.SELECT_USERS)

    return res.status(200).send(result[0])
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred')
  }
}

export const getUser = async (req: Request, res: Response): Promise<Response<User>> => {
  try {
    const pool = await mysqlConnection();
    const result: ResultQuery = await pool.query(USER_QUERY.SELECT_USER, [req.params.userId])

    if (result[0].length > 0) {
      return res.status(200).send(result[0])
    } else {
      return res.status(404).send('User not found')
    }

  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred')
  }
}

export const createUser = async (req: Request, res: Response): Promise<Response<User>> => {
  const { name, username, email, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const encryptedPassword = bcrypt.hashSync(password, salt)

  try {
    const pool = await mysqlConnection();
    const newUser = {
      name,
      username,
      email,
      password: encryptedPassword
    }
    const result: ResultQuery = await pool.query(USER_QUERY.CREATE_USER, Object.values(newUser))
    
    return res.status(200).send(newUser)

  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred')
  }
}

export const updateUser = async (req: Request, res: Response): Promise<Response<User>> => {
  const user: User = {...req.body}

  try {
    const pool = await mysqlConnection();
    const result: ResultQuery = await pool.query(USER_QUERY.SELECT_USER, [req.params.userId])

    if (result[0].length > 0) {
      const updateUserQuery = await pool.query(USER_QUERY.UPDATE_USER, [...Object.values(user), req.params.userId])
      return res.status(200).send('User updated')
    } else {
      return res.status(404).send('User not found')
    }
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred')
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response<User>> => {
  try {
    const pool = await mysqlConnection();
    const result: ResultQuery = await pool.query(USER_QUERY.DELETE_USER, [req.params.userId])

    if (result[0].length > 0) {
      const updateUserQuery = await pool.query(USER_QUERY.DELETE_USER, [req.params.userId])
      return res.status(200).send('User deleted')
    } else {
      return res.status(404).send('User not found')
    }
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred')
  }
}