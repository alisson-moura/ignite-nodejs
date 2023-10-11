import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const currentRoute = routes.find(route =>
    route.method === method &&
    route.path === url)

  if(currentRoute) {
    return currentRoute.handler(req, res)
  }

  return res.writeHead(404).end("Not found")
})

server.listen(3000)