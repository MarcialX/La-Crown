//*********************PASSPORT.JS**************************
//Acceso a Facebook

//Simulando las URL del albúm de cada perfil
var albumURL = ['http://p2.trrsf.com/image/fget/cf/600/600/images.terra.com/2016/05/17/homero.png',
                'https://i.ytimg.com/vi/hpMTjjb9ab4/hqdefault.jpg',
                'http://k42.kn3.net/taringa/5/2/5/0/7/4//nachoorc/97D.jpg?6139',
                'http://res.cloudinary.com/db79cecgq/image/upload/c_crop,h_811,w_1437,x_0,y_47/c_fill/v1409347738/Thinkstock---Spondylolithesis.jpg',
                'http://k07.kn3.net/taringa/8/5/2/8/7/2/2/karloshatake/434.jpg',
                'http://turismo.mexicoxp.com//store_imgs_web/imgsfe/desplegados/7_Maravillas_de_Mexico.jpg',
                'https://c.tadst.com/gfx/750w/rapa-nui-chile.jpg?1',
                'http://hotelesen.com.mx/wp-content/uploads/2015/06/chichen-itza-683193_640.jpg',
                'http://www.vecindad.com.mx/wp-content/uploads/2012/07/mexicocity_homepage.jpg',
                'https://reservamosmx.files.wordpress.com/2016/04/valle-cirios-ensenada.jpg?w=768',
                'https://media-cdn.tripadvisor.com/media/photo-s/01/c2/79/a1/ensenada.jpg',
                'http://static1.sobrehistoria.com/wp-content/uploads/2015/10/Taj-Mahal-Maravillas-del-Mundo-600x449.jpg',
                'http://1.bp.blogspot.com/-BOwNcWPyN0M/UyGvsFgLagI/AAAAAAAAAGw/Jpb0MV-bH94/s1600/%C3%A1guilareal.jpg',
                'http://static1.sobrehistoria.com/wp-content/uploads/2015/07/siete-maravillas-del-mundo-antiguo-la-gran-piramide-de-giza.jpg',
                'http://www.viajesalazul.com/wp-content/uploads/2013/09/Coliseo-romano2.jpg',
                'http://graduaciones.org/wp-content/uploads/2012/01/dp17669971.jpg',
                'http://www.revistaes.com/wp-content/uploads/2015/04/bici.jpg',
                'http://www.elfinanciero.com.mx/files/article_main/uploads/2016/09/29/57ed1158a1749.jpg',
                'http://www.elfinanciero.com.mx/files/article_main/uploads/2016/06/01/574f321312642.jpg',
                'http://www.debate.com.mx/export/sites/debate/img/2016/10/01/imagen_051e4231a12e417cbc2de8291afc173d-0.jpg_793226115.jpg',
                'http://s3-eu-west-1.amazonaws.com/rankia/images/valoraciones/0005/9334/Vacaciones%20subasteras.jpg?1326031015',
                'https://i.ytimg.com/vi/mm7_gAUzFrE/maxresdefault.jpg',
                'http://www.lne.es/elementosWeb/gestionCajas/MMP/Image/castillo-coca.jpg',
                'https://almaleonor.files.wordpress.com/2015/01/110963__the-lord-of-the-rings-lord-of-the-rings-the-characters-the-frame-of-the-movie_p.jpg',
                'https://imgs-tuts-dragoart-386112.c.cdn77.org/how-to-draw-a-tie-fighter-tie-fighter-star-wars_1_000000015624_5.gif',
                'http://www.ecartelera.com/images/sets/7900/7994.jpg',
                'https://cde.peru.com/ima/0/1/3/0/8/1308237/924x530/spiderman.jpg',
                'https://lh5.ggpht.com/-XgaAay7vvHw/UEPi4p-n7tI/AAAAAAAAGIo/mqoHLaCupm4/Cientificos_thumb%25255B2%25255D.jpg?imgmax=800',
                'https://upload.wikimedia.org/wikipedia/commons/d/da/Mimas_moon.jpg',
                'http://www.astrophoto.com.mx/upload/2010/05/14/20100514120327-d16ea237.jpg'];   

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

                    albumURL.forEach(function(value){
                        user.albumPhoto.addToSet(value)
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