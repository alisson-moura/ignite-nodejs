import { execSync } from 'node:child_process'
import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest'
import request from 'supertest'
import { fastify } from '../src/app'

let token: string
let mealId: string
describe('Remover uma refeição', () => {
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

  it('Deve ser possível deletar uma refeição', async () => {
    const response = await request(fastify.server)
      .delete(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)

    const listMealsResponse = await request(fastify.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)
    const meals = listMealsResponse.body.meals

    expect(response.status).toEqual(204)
    expect(meals.find((meal: any) => meal.id === mealId)).toEqual(undefined)
  })
})
