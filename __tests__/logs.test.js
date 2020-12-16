const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Log = require('../lib/models/log');
const Recipe = require('../lib/models/recipe');


describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  afterAll(() => {
    return pool.end();
  });

  it.only('creates a log', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    const response = await request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: recipe.id,
        dateOfEvent: 'Next Blurnsday',
        notes: 'make it Caliente',
        rating: 1
      });
    expect(response.body).toEqual({
      id: '1',
      recipeId: recipe.id,
      dateOfEvent: 'Next Blurnsday',
      notes: 'make it Caliente',
      rating: 1
    });
      
  });

  it('gets all logs', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
    const logs = await Promise.all([
      { recipeId: recipe.id,
        dateOfEvent: 'Next Blurnsday',
        notes: 'make it Caliente',
        rating: 1
      },
      { recipeId: recipe.id,
        dateOfEvent: 'Fourth of July',
        notes: 'viscous as possible',
        rating: 2
      }
    ].map(log => Log.insert(log)));

    const response = await request(app)
      .get('/api/v1/logs');

    expect(response.body).toEqual(expect.arrayContaining(logs));
    expect(response.body).toHaveLength(logs.length);
  });

  it('gets specific log by Id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    const log = await Log.insert({
      id: '1',
      recipeId: recipe.id,
      dateOfEvent: 'Next Blurnsday',
      notes: 'make it Caliente',
      rating: 1

    });
    const response = await request(app)
      .get(`/api/v1/logs/${log.id}`);

    expect(response.body).toEqual({
      id: '1',
      recipeId: recipe.id,
      dateOfEvent: 'Next Blurnsday',
      notes: 'make it Caliente',
      rating: 1
    });
  
  });

  it('updates a log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    const log = await Log.insert({ 
      recipeId: recipe.id,
      dateOfEvent: 'Next Blurnsday',
      notes: 'make it Caliente',
      rating: 1

    });

    const response = await request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        recipeId: recipe.id,
        dateOfEvent: 'Next Blurnsday',
        notes: 'make it Caliente',
        rating: 1
      });

    expect(response.body).toEqual({
      recipeId: recipe.id,
      dateOfEvent: 'Next Blurnsday',
      notes: 'make it Caliente',
      rating: 1
    });
  });

  it('DELETE specific log by Id', async() => {

    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    const log = await Log.insert({
      recipeId: recipe.id,
      dateOfEvent: 'Next Blurnsday',
      notes: 'make it Caliente',
      rating: 1

    });
    const response = await request(app)
      .delete(`/api/v1/logs/${log.id}`);

    expect(response.body).toEqual({
      id: log.id,
      recipeId: recipe.id,
      dateOfEvent: 'Next Blurnsday',
      notes: 'make it Caliente',
      rating: 1
    });
  });

  
});
