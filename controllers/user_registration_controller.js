const userRegistrationModel = require('../models/user_registration_model');
const jwt = require('jsonwebtoken');

exports.homepage = (request, response) => {
  response.render('home')
}

exports.form = (request, response) => {
  response.render('form')
}

exports.listAll = (request, response) => {
  let tokenAuth = request.headers.authorization;

  // Check Token
  if( tokenAuth === undefined || tokenAuth === null || tokenAuth === '' ) {
    response.status(403).send( {message: 'failed to get data', status: 403} );
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      response.status(403).send( {message: 'failed to get data', status: 403} );
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'myPrivateKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        response.status(401).send( {message: 'failed to get token', status: 401} );
      } else {
        userRegistrationModel.find().sort( {_id: -1} )
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
    }
  }  
}  

exports.insert = async (request, response) => {  
  let datax = await request.body;

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

exports.removeOne = async (request, response) => {
  let tokenAuth = request.headers.authorization;

  // Check Token
  if( tokenAuth === undefined || tokenAuth === null || tokenAuth === '' ) {
    response.status(403).send( {message: 'failed to get data', status: 403} );
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      response.status(403).send( {message: 'failed to get data', status: 403} );
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'myPrivateKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        response.status(401).send( {message: 'failed to get token', status: 401} );
      } else {
          let _id = await request.params._id;
          console.log(_id);
          console.log('Bearer ? '+newTokenAuth[0]);
          console.log('Token ? ' +newTokenAuth[1]);          

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
    }
  }
}

exports.deleteOne = (request, response) => {
  let tokenAuth = request.headers.authorization;

  // Check Token
  if( tokenAuth === undefined || tokenAuth === null || tokenAuth === '' ) {
    response.status(403).send( {message: 'failed to get data', status: 403} );
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      response.status(403).send( {message: 'failed to get data', status: 403} );
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'myPrivateKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        response.status(401).send( {message: 'failed to get token', status: 401} );
      } else {
        let _id = request.params._id;
        console.log(_id);
        console.log('Bearer ? '+newTokenAuth[0]);
        console.log('Token ? ' +newTokenAuth[1]);

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
    }
  }  
}

exports.findOne = async (request, response) => {
  let _params = await request.params._id;

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

exports.searchOne = async (request, response) => {
  let uname = await request.params.uname;

  /* keluarin cuma 1 hasil */
  // userRegistrationModel.findOne({ username: RegExp(uname) })

  /* keluarin banyak hasil */
  userRegistrationModel.find({ username: RegExp(uname) }).sort( {_id: -1} ).exec()
  .then(res => {
    // console.log( RegExp(uname) );
    // console.log(res);

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
      message: "Failed to find a data",
      result: err
    })
  })
}

exports.updateOne = async (request, response) => {
  let datax = await request.body;

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

exports.login = (request, response) => {
  response.render('login');
}

exports.loginTester = async (request, response) => {
  let uname = request.body.username;
  let pass = request.body.password;

  //if - else checking input
  if( uname === '' || pass === '' || uname === null || pass === null ) {
    response.send( {
      message: "Invalid username or password",
      result: "Invalid username or password",
      status: 404
    } )
  } else {
    const userData = await userRegistrationModel.findOne( {username: uname, password: pass} ).exec()

    if( userData === null || userData === 'undefined' ) {
      response.send( {
        message: "Hey, Invalid username or password",
        result: "Hey, Invalid username or password",
        status: 404
      } )      
    } else {
      let token = jwt.sign( {
        username: userData.username,
        email: userData.email,
      }, 'myPrivateKey' );

      // console.log("Token : " +token);

      let passingData = {
        uid: userData._id,
        username: userData.username,
        email: userData.email,
        age: userData.age,
        address: userData.address,
        token: token,
        token_type: 'Bearer'
      }

      // console.log(passingData);

      response.send({
        message: "Login Accepted",
        result: passingData,
        status: 200
      })
    }
  }
}

exports.logout = async (request, response) => {
  //redirect to login page
  response.render('login');
}

exports.author = (request, response) => {
  let tokenAuth = request.headers.authorization;

  // Check Token
  if( tokenAuth === undefined || tokenAuth === null || tokenAuth === '' ) {
    response.status(403).send( {message: 'failed to get data', status: 403} );
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      response.status(403).send( {message: 'failed to get data', status: 403} );
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'myPrivateKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        response.status(401).send( {message: 'failed to get token', status: 401} );
      } else {
        // on us - mau ngapain aja jika tokennya benar??
        userRegistrationModel.find().exec()
        .then(resp => {
          response.send({
            message: 'Authorization passed',
            result: resp,
            status: 200
          });
        })
        .catch(error => {
          response.status(500).send({message: 'failed to fetch data', status:500})
        })

      }
    }
  }
}