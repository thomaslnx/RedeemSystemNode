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

    const checkIfUserAlreadyExist = await pool.query(`SELECT * FROM users WHERE email = '${email}'`)

    if (checkIfUserAlreadyExist[0].length) {
      return res.status(400).json({ message: 'Error! username or email already exists!'})
    }
    const result: ResultQuery = await pool.query(USER_QUERY.CREATE_USER, Object.values(newUser))
    
    return res.status(200).send(newUser)

  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred')
  }
}

export const updateUser = async (req: Request, res: Response): Promise<Response<User>> => {
  const { name, username, email, password } = req.body
  const { userId } = req.params
  let updateDynamicQuery = []

  try {
    const pool = await mysqlConnection();
    const result: ResultQuery = await pool.query(USER_QUERY.SELECT_USER, [req.params.userId])

    if (result[0].length > 0) {
      if (name !== null && name !== undefined) {
        updateDynamicQuery.push(`name = '${name}'`)
      }

      if (username !== null && username !== undefined) {
        updateDynamicQuery.push(`username = '${username}'`)
      }

      if (email !== null && email !== undefined) {
        updateDynamicQuery.push(`email = '${email}'`)
      }

      if (password !== null && password !== undefined) {
        updateDynamicQuery.push(`password = '${password}'`)
      }

      const updateUserQuery = await pool.query(`UPDATE users SET ${updateDynamicQuery.join(', ')} WHERE id = ${userId}`)

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
  const { userId } = req.params
  try {
    const pool = await mysqlConnection();
    const checkIfDeletingUserHasRedemptions = await pool.query(`SELECT * FROM redemptions WHERE user_id = 5`)

    if (checkIfDeletingUserHasRedemptions[0].length) {
      return res.status(400).json({
        message: 'This user cannot be deleted because he has made redemptions!'
      })
    } else {
      const result: ResultQuery = await pool.query(USER_QUERY.DELETE_USER, [userId])
      return res.status(200).send('User deleted')
    }

    if (result[0].length > 0) {
      const deleteUserQuery = await pool.query(USER_QUERY.DELETE_USER, [userId])

      return res.status(200).send('User deleted')
    } else {
      return res.status(404).send('User not found')
    }
  } catch (err: unknown) {
    console.error(err)

    return res.status(500).send('An error occurred')
  }
}