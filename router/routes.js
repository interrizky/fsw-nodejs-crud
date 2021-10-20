const express = require('express');
const routes = express.Router();

//Controller (menyambungkan controller ke Routes)
const userRegistrationCotroller = require('../controllers/user_registration_controller');

// halaman pertama
routes.get('/home', userRegistrationCotroller.homepage);

// get all data from database
routes.get('/list_all', userRegistrationCotroller.listAll);

// href delete pada table
routes.get('/remove/:_id', userRegistrationCotroller.removeOne);
// button delete pada modal
routes.post('/delete/:_id', userRegistrationCotroller.deleteOne);

// href update pada table - menampilkan ke form baru
routes.get('/find/:_id', userRegistrationCotroller.findOne);

// search data
routes.get('/search/:uname', userRegistrationCotroller.searchOne)

// tombol update pada form
routes.post('/update_data', userRegistrationCotroller.updateOne);

// halaman form
routes.get('/form', userRegistrationCotroller.form);
routes.post('/post_data', userRegistrationCotroller.insert);


//Export ke index.JS
module.exports = routes;