import { execSync } from 'node:child_process'
import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest'
import request from 'supertest'
import { fastify } from '../src/app'

describe('Exibir profile do cliente que solicitou', () => {
  beforeAll(async () => {
    await fastify.ready()
  })
  afterAll(async () => {
    await fastify.close()
  })
  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
    await request(fastify.server)
      .post('/users')
      .send({
        name: 'fake name',
        email: 'fakeMail@mail.com',
        password: '123456'
      })
  })

  it.only('Deve exibir os dados o cliente através do seu token', async () => {
    const responseToken = await request(fastify.server)
      .post('/signup')
      .send({
        email: 'fakeMail@mail.com',
        password: '123456'
      })
    const token = responseToken.body.token

    const response = await request(fastify.server)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
  })
})
