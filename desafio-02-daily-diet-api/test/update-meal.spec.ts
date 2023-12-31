import { execSync } from 'node:child_process'
import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest'
import request from 'supertest'
import { fastify } from '../src/app'

let token: string
let mealId: string
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

    // create an meal
    const meal = await request(fastify.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Almoço',
        description: 'arroz, feijão e bife',
        dietStatus: true
      })
    mealId = meal.body.meal.id
  })

  it('Deve ser possível atualizar uma refeição', async () => {
    await request(fastify.server)
      .put(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Almoço atualizado',
        description: 'arroz, feijão, bife e batata frita',
        dietStatus: false
      })

    const updatedMeal = await request(fastify.server)
      .get(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(updatedMeal.status).toEqual(200)
    expect(updatedMeal.body).toHaveProperty('meal')
    expect(updatedMeal.body.meal).toEqual(
      expect.objectContaining({
        name: 'Almoço atualizado',
        description: 'arroz, feijão, bife e batata frita',
        dietStatus: 0,
        id: mealId
      })
    )
  })
})
