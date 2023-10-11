import { Database } from './database.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: '/users',
    handler: function (req, res) {
      const users = database.select('users')
      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler: function (req, res) {
      const { name, email } = req.body
      database.insert('users', { id: randomUUID(), name, email })
  
      return res.writeHead(201).end()
    }
  }
]