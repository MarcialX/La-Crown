//*********************BASE DE DATOS************************
//Base de datos en Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Campos de la base de datos:
//Nombre, ID, Foto, fecha de registro
var UserSchema = new Schema({
	name: String,
	provider: String,
	provider_id: {type: String, unique: true},
	photo: String,
	createdAt: {type: Date, default: Date.now}
});

//Se crea el modelo
var User = mongoose.model('User', UserSchema);