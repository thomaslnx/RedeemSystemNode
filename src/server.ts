import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

import swaggerDocs from './swagger.json'
import { pointsRoutes, userRoutes, rewardsRoutes, redemptionsRoutes } from './routes/index.ts'

export class Server {
  private readonly server: Application
  
  constructor(private readonly port: (string | number) = process.env.SERVER_PORT || 3001) {
    this.server = express()
    this.middleware()
    this.routes()
  }

  listen(): void {
    this.server.listen(this.port)
    console.info(`Server up and running 🚀 at port: ${this.port}!`)
  }

  private middleware(): void {
    this.server.use(cors({ origin: '*' }))
    this.server.use(express.json())
  }

  private routes(): void {
    this.server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
    this.server.use('/points', pointsRoutes)
    this.server.use('/users', userRoutes)
    this.server.use('/rewards', rewardsRoutes)
    this.server.use('/redemptions', redemptionsRoutes)
  }
}