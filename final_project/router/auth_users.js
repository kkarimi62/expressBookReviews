const express    = require('express');
const jwt        = require('jsonwebtoken');
let books        = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}


// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  }); 
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true; 
  } else {
      return false;
  }   
}           


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  //--- get isbn and review
  let isbn   = req.params.isbn;
  let review = req.query.review;
  let user   = req.session.authorization.username;

  if(!isbn || !review){
    return res.status(400).send('invalid isbn and/or review');
  };

  //--- get book by isbn
  let bookByisbn = [];
  let keyByisbn  = [];
  for(let key in books){
    if(books[key].isbn === isbn){
      bookByisbn.push( books[key] );
      keyByisbn.push( key );
    };
  };
  if( bookByisbn.length === 0 ){
    return res.status(400).json({message:'book does not exist!'})
  };

  //--- add review
  let myBook            = bookByisbn[0];
  let existingReviews   = myBook.reviews;
  //let num_reviews       = Object.keys( existingReviews ).length + 1;
  //let key               = `review${num_reviews}`;
  existingReviews[user]  = review;
  myBook.reviews        = existingReviews;
  
  //--- assign to book
  let bookKey           = keyByisbn[ 0 ];
  books[ bookKey ]      = myBook;

  return res.status(200).send('posted review: '+JSON.stringify(review)+'\nby user:'+user);
});


// delete a review

regd_users.delete('/auth/review/:isbn', (req,res)=>{
  let isbn   = req.params.isbn;
  let myUser = req.session.authorization.username;
  if(!isbn){
    return res.status(400).json({message:'invalid isbn!'});
  };

  // fetch the corresponding book
  let bookByisbn = [];
  let keyByisbn  = [];
  for(let key in books){
    if( books[ key ].isbn === isbn ){
      bookByisbn.push( books[ key ] )
      keyByisbn.push( key )
    };
  };
  console.log('book:',bookByisbn);

  if( bookByisbn.length === 0 ){
    return res.status(400).json({message:'book not found!'});
  };

  // remove review
  let bookObj = bookByisbn[ 0 ]
  let bookKey = keyByisbn[ 0 ]
  let reviews = bookObj.reviews;
  delete reviews[ myUser ];
  bookObj.reviews = reviews;

  // assign
  books[ bookKey ] = bookObj;

  return res.status(200).send(`Reviews for the ISBN:${isbn} by the user:${myUser} deleted.`);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
