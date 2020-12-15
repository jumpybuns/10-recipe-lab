const { Router } = require('express');
const Recipe = require('../models/recipe');


module.exports = Router()
  .post('/api/v1/recipes', (req, res, next) => {
    Recipe
      .insert(req.body)
      .then(recipe => res.send(recipe))
      .catch(next);
            
  })
        
  .get('/api/v1/recipes', (req, res, next) => {
    Recipe
      .find()
      .then(recipes => res.send(recipes))
      .catch(next);
            
  })
        
  .get('/api/v1/recipes/:id', (req, res, next) => {
    Recipe
      .findById(req.params.id)
      .then(recipe => res.send(recipe))
      .catch(next);
        
  })
        
  .put('/api/v1/recipes/:id', (req, res, next) => {
    Recipe
      .update(req.params.id, req.body)
      .then(recipe => res.send(recipe))
      .catch(next);
  })
        
  .delete('/api/v1/recipes/:id', (req, res, next) => {
    Recipe
      .delete(req.params.id)
      .then(recipe => res.send(recipe))
      .catch(next);
  });
