import { execSync } from 'node:child_process'
import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest'
import request from 'supertest'
import { fastify } from '../src/app'

let token: string
describe('Atualização de uma refeição', () => {
  beforeAll(async () => {
    await fastify.ready()
  })
  afterAll(async () => {
    await fastify.close()
  })
  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')

    // create user
    await request(fastify.server)
      .post('/users')
      .send({
        name: 'fake name',
        email: 'fakeMail@mail.com',
        password: '123456'
      })
    // get a token
    const responseToken = await request(fastify.server)
      .post('/signup')
      .send({
        email: 'fakeMail@mail.com',
        password: '123456'
      })
    token = responseToken.body.token
  })

  it.todo('Deve ser possível cadastrar uma refeição')
})
