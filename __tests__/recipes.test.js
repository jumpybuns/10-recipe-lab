const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const Recipe = require('../lib/models/recipe');
const app = require('../lib/app');


describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  afterAll(() => {
    return pool.end();
  });

  it('POST creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        ingredients: [
          { amount: 'pinch', item: 'salt' },
          { amount: 'handful', item: 'sugar' },
          { amount: '1 bucket', item: 'love' }
        ],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          ingredients: [
            { amount: 'pinch', item: 'salt' },
            { amount: 'handful', item: 'sugar' },
            { amount: '1 bucket', item: 'love' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('gets specific recipe by Id', async() => {

    const recipe = await Recipe.insert({
      id: 1,
      name: 'cookies',
      ingredients: [], 
      directions: []
    });
    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        (recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      ingredients: [
        { amount: 'pinch', item: 'salt' },
        { amount: 'handful', item: 'sugar' },
        { amount: '1 bucket', item: 'love' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        ingredients: [
          { amount: 'pinch', item: 'salt' },
          { amount: 'handful', item: 'sugar' },
          { amount: '1 bucket', item: 'love' }
        ],
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          ingredients: [
            { amount: 'pinch', item: 'salt' },
            { amount: 'handful', item: 'sugar' },
            { amount: '1 bucket', item: 'love' }
          ],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('DELETE specific recipe by Id', async() => {

    const recipe = await Recipe.insert({
      id: 1,
      name: 'cookies',
      ingredients: [],
      directions: []
    });
    return request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        (recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  
});
