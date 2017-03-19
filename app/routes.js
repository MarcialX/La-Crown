//********************PROYECTO CORONA ROUTES.JS**************************
//Servidor Express
var express = require('express');
var path    = require('path');

//Manejador de archivos
var fs = require('fs');

//WATSON Visual Recognition
var watson = require('watson-developer-cloud');
//Configuración inicial Watson
var config = require('./config');
var visual_recognition = watson.visual_recognition({
  api_key: config.watson_VR.api_key,
  version: config.watson_VR.version,
  version_date: config.watson_VR.version_date
});

//Autenticar con Facebook
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
//Método GET
router.get('/detectingImage', function(req, res) {
  var value = req.param('pic')
  res.render('pages/detectingImage', {
      photo: value
  });
});
//Método POST
router.post('/detectingImage', function(req, res) {
  //Detección de la imagen!
  imageAnalysis(req.body.photo);
});

//Análisis de la imagen
function imageAnalysis(imageURL){

  var params = {
    url: imageURL
  };

  visual_recognition.classify(params, function(err, res) {
    if (err)
      console.log(err);
    else
      console.log(JSON.stringify(res, null, 2));
  });

}