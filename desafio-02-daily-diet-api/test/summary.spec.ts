import { execSync } from 'node:child_process'
import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest'
import request from 'supertest'
import { fastify } from '../src/app'
import { object } from 'zod'

let token: string
describe('Recuperação de Métricas do Usuário', () => {
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

    // create an meal in diet
    await request(fastify.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Almoço',
        description: 'arroz, feijão e bife',
        dietStatus: true
      })

    // create an meal out diet
    await request(fastify.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Janta',
        description: 'pizza',
        dietStatus: false
      })
  })

  it(`Os usuários devem poder obter informações sobre suas métricas, 
      incluindo a quantidade total de refeições registradas, a quantidade de refeições dentro e fora da dieta, `,
    async () => {
      const response = await request(fastify.server)
        .get('/meals/summary')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toEqual(200)
      expect(response.body).toHaveProperty('summary')
      expect(response.body.summary).toEqual(
        expect.objectContaining({
          amountOfMeals: 2,
          mealsInDiet: 1,
          mealsOutDiet: 1
        })
      )
    })
})
