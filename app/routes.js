//********************PROYECTO CORONA ROUTES.JS**************************
//Servidor Express
var express = require('express');
var path    = require('path');

var passport = require('passport');

//Objeto ruteador
var router = express.Router();

//Para exportar el ruteador
module.exports = router;

//Ruta de la Home Page
router.get('/', function(req, res) {
  res.render('pages/index');
});

//Ruta Album facebook (despúes de Log in)
router.get('/imageLoad', function(req, res) {
  res.render('pages/imageLoad', {
      user: req.user
  });
});

//Ruta para desloguearse
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Ruta para autenticarse con Facebook (enlace de login)
router.get('/auth/facebook', passport.authenticate('facebook'/*,{scope:['email']}*/));

// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
router.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/imageLoad', failureRedirect: '/login' }),
  function(res, req){
    res.redirect('/');
});

//Ruta Análisis de imagen
router.get('/detectingImage/:url', function(req, res) {
  res.render('pages/detectingImage');
});