//*********************PASSPORT.JS**************************
//Acceso a Facebook

//Objeto Mongoose de la base de datos
var mongoose = require('mongoose');
//Modelo de base de datos
var User = mongoose.model('User');

//Conexión con FB, solicita las KEYS del archivo config
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');

module.exports = function(passport) {

    //El objeto usuario queda almacenado en la sesión de la aplicación
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    //Credenciales de la app de Facebook
    passport.use(new FacebookStrategy({
        clientID: config.facebook.id,
        clientSecret: config.facebook.secret,
        callbackURL: '/auth/facebook/callback',
        profileFields : ['id', 'displayName', 'picture.type(large)']
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
            User.findOne({provider_id: profile.id}, function(err, user) {
                if(err) throw(err);
                if(!err && user!= null) {
                    return done(null, user);
                } else {
                    //Si el usuario no existe crea uno y lo almacena en la base de datos
                    var user = new User({
                        provider_id: profile.id,
                        provider: profile.provider,
                        name: profile.displayName,
                        photo: profile.photos[0].value
                    });

                    user.save(function(err) {
                        if(err) throw err;
                        return done(null, user);
                    });
                }
            });
        });
    }));
}