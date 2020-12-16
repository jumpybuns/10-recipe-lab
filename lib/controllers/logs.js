const { Router } = require('express');
const Log = require('../models/log');


module.exports = Router()
  .post('/api/v1/logs', (req, res, next) => {
    Log
      .insert(req.body)
      .then(log => res.send(log))
      .catch(next);
            
  })
        
  .get('/api/v1/logs', (req, res, next) => {
    Log
      .find()
      .then(logs => res.send(logs))
      .catch(next);
            
  })
        
  .get('/api/v1/logs/:id', (req, res, next) => {
    Log
      .findById(req.params.id)
      .then(log => res.send(log))
      .catch(next);
        
  })
        
  .put('/api/v1/logs/:id', (req, res, next) => {
    Log
      .update(req.params.id, req.body)
      .then(log => res.send(log))
      .catch(next);
  })
        
  .delete('/api/v1/logs/:id', (req, res, next) => {
    Log
      .delete(req.params.id)
      .then(log => res.send(log))
      .catch(next);
  });
