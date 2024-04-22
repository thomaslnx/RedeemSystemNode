import { Server } from './server.ts'

const initServer = (): void => {
  const newServer = new Server()

  newServer.listen()
}

initServer()