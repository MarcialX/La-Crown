//********************PROYECTO CORONA SERVER.JS**************************
//Servidor Express
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var errorhandler = require('errorhandler')();

//EJS Template
var expressLayouts = require('express-ejs-layouts');

//Manejador de la base de datos MongoDB
var mongoose = require('mongoose');
//Middleware de Node que facilita la autenticación de usuarios
var passport = require('passport');
//var request = require('request');

//Importamos modelo de usuario y configuración de passport
require('./models/user');
require('./app/passport')(passport);

//Conexión a la base de datos de MongoDB en servidor local
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/data_users',function(err,res){
	if(err) throw err;
	console.log('Conectado con éxito a la base de datos :)');
});

//Utilizando el servidor express
var app = express();

//Llamando a los manejadores de rutas
var router = require('./app/routes');

//Dirección de los recursos (CSS, imagenes, etc.)
app.use(express.static(__dirname + '/public'));

app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Para recordar el objeto usuario aunque abandonemos la página
app.use(session({secret: "Aradmagol"}));

//Configuración de Passport.
//Inicialización y configuración
app.use(passport.initialize());
app.use(passport.session());

//EJS layout
app.set('view engine','ejs');
app.use(expressLayouts);

//Controlador
app.use('/', router);

//Manejo de errores más detallado
app.use(function(err, req, res, next) {
  if (app.get('env') === 'development') {
    return errorhandler(err, req, res, next);
  } else {
    res.sendStatus(401);
  }
});

//Iniciamos el servidor
var server = app.listen(process.env.PORT || 5000, () => {
  console.log('Servidor express escuchando por el puerto %d en el modo %s', server.address().port, app.settings.env);
});