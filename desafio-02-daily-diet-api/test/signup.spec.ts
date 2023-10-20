import { execSync } from 'node:child_process'
import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest'
import request from 'supertest'
import { fastify } from '../src/app'

describe('Cadatro de usuários', () => {
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

  it('Deve ser possível realizar login', async () => {
    const response = await request(fastify.server)
      .post('/signup')
      .send({
        email: 'fakeMail@mail.com',
        password: '123456'
      })

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('token')
  })
  it('Deve retornar o status 400 e um erro caso o email esteja incorreto',
    async () => {
      const response = await request(fastify.server)
        .post('/signup')
        .send({
          email: 'wrongMail@mail.com',
          password: '123456'
        })

      expect(response.status).toEqual(400)
      expect(response.body).toHaveProperty('error')
    })
  it('Deve retornar o status 400 e um erro caso a senha esteja incorreta',
    async () => {
      const response = await request(fastify.server)
        .post('/signup')
        .send({
          email: 'fakeMail@mail.com',
          password: 'wrong_password'
        })

      expect(response.status).toEqual(400)
      expect(response.body).toHaveProperty('error')
    })
})
