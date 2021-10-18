const userRegistrationModel = require('../models/user_registration_model')

exports.homepage = (request, response) => {
  response.render('home')
}

exports.form = (request, response) => {
  response.render('form')
}

exports.listAll = (request, response) => {
  userRegistrationModel.find()
  .then(resp => {
    response.send({
      message: "Displaying Current Collections From MongoDB",
      result: resp
    })
  })
  .catch(err => {
    response.send({
      message: "failed to read data",
      result: err
    })
  })  
}  

exports.insert = (request, response) => {  
  let datax = request.body;

  const user_registration_data = new userRegistrationModel({
    username: datax.username,
    password: datax.password,
    email: datax.email,
    address: datax.address,
    age: datax.age
  })

  /* saving to database then sending to frontend - grab in callback result */
  user_registration_data.save(user_registration_data)
  .then(res => {
    response.send({
      message: "Success",
      result: res
    })
  })
  .catch(err => {
    response.send({
      message: "Failed",
      result: err
    })
  })  
}

exports.search = (request, response) => {
  // let inputSearch = request.body.username;
  // let query = {username: request.body.username}; 
  // console.log(userRegistrationModel.find(query));
  // userRegistrationModel.find( {username: inputSearch} )
}

exports.removeOne = (request, response) => {
  let _id = request.params._id;
  console.log(_id);

  userRegistrationModel.deleteOne( { _id: _id } )
  .then(resp => {
    response.send({
      message: "Delete Success",
      result: _id
    })
  })
  .catch(err => {
    response.send({
      message: "Failed to Delete Data",
      result: err
    })
  })  
}

exports.findOne = (request, response) => {
  let _params = request.params._id;

  userRegistrationModel.findOne({ _id: _params })
  .then(resp => {
    let params = {
      _id:JSON.stringify(resp._id),
      username:JSON.stringify(resp.username),
      password:JSON.stringify(resp.password),
      email:JSON.stringify(resp.email),
      address:JSON.stringify(resp.address),
      age:JSON.stringify(resp.age) 
    } 
    response.render('form_edit', params)
  })
  .catch(err => {
    response.send({
      message: "Failed to read data to edit",
      result: err
    })
  })
}

exports.searchOne = (request, response) => {
  let uname = request.params.uname;

  userRegistrationModel.findOne({ username: uname })
  .then(res => {
    console.log(res)
    console.log(res.username)

    /* jangan dihapus - lesson learned - mengirim data ke depan harus dalam bentuk JSON / Object */
    // response.render('home', params)
    // response.send((res.username).toString())
    response.send({
      message: "Success To Fetch Data",
      result: res
    })
  })
  .catch(err => {
    response.send({
      message: "failed to find a data",
      result: err
    })
  })
}

exports.updateOne = (request, response) => {
  let datax = request.body;

  console.log(datax);
  console.log(datax._id);
  console.log(datax.username);

  let params = {
    username:datax.username,
    password:datax.password,
    email:datax.email,
    address:datax.address,
    age:datax.age 
  }

  userRegistrationModel.updateOne({_id: datax._id}, params)
  .then(resp => {
    response.send({
      message: "Update Success",
      result: datax._id
    })
  })
  .catch(err => {
    response.send({
      message: "failed to update data",
      result: err
    })
  })
}