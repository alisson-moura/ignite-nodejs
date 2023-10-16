import http from 'node:http'
import { json } from './middlewares/json.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { routes } from './routes.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req
  await json(req, res)

  const currentRoute = routes.find(route =>
    route.method === method &&
    route.path.test(url))
  if (currentRoute) {
    const {query, ...params} = req.url.match(currentRoute.path).groups
    req.query = query ? extractQueryParams(query) : {}
    req.params = params ? params : {}

    return currentRoute.handler(req, res)
  }

  return res.writeHead(404).end("Not found.")
})

server.listen(3000, console.log('API is running on http://localhost:3000'))

