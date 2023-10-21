import { execSync } from 'node:child_process'
import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest'
import request from 'supertest'
import { fastify } from '../src/app'

let token: string
let mealId: string
describe('Exbir detalhes de uma refeição', () => {
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

    // create an meal
    const responseMeal = await request(fastify.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Almoço',
        description: 'arroz, feijão e bife',
        dietStatus: true
      })
    mealId = responseMeal.body.meal.id
  })

  it('Deve ser exibir os detalhes de uma refeição', async () => {
    const response = await request(fastify.server)
      .get(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body).toHaveProperty('meal')
    expect(response.body.meal).toEqual(
      expect.objectContaining({
        name: 'Almoço',
        description: 'arroz, feijão e bife',
        dietStatus: 1,
        id: mealId
      })
    )
  })
  it('Deve retornar um erro caso o id informado seja incorreto', async () => {
    const response = await request(fastify.server)
      .get('/meals/wrong_id')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(400)
  })
})
