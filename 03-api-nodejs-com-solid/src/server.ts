import { app } from "./app";

app.listen({
  host: '0.0.0.0',
  port: 3000
})
  .then(() => { console.log('API running is http://localhost:3000') })
  .catch(err => { console.log(err) })